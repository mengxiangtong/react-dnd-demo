import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DragUpdate,
} from 'react-beautiful-dnd';
import update from 'immutability-helper';
import styles from './index.less';
import { Component } from 'react';

const data = [
  {
    id: 100,
    name: 'todo',
    issues: [
      {
        id: 1,
        name: '待备料',
      },
      {
        id: 2,
        name: '已备料',
      },
      {
        id: 3,
        name: '未备料',
      },
      {
        id: 6,
        name: 'uten6',
      },
    ],
    acceptIds: [100, 200, 300],
  },
  {
    id: 200,
    name: 'doing',
    issues: [
      {
        id: 4,
        name: '已完工',
      },
    ],
    acceptIds: [100, 200, 300],
  },
  {
    id: 300,
    name: 'done',
    issues: [
      {
        id: 5,
        name: '未完工',
      },
    ],
    acceptIds: [100, 200, 300],
  },
];

interface initialDataInferface {
  id: number;
  name: string;
  issues: {
    id: number;
    name: string;
  }[];
  acceptIds: number[];
}

interface ColumnProps {
  columnIndex: number;
  activeColumn: initialDataInferface | null;
  column: initialDataInferface;
}

interface IssueProps {
  id: number;
  issueIndex: number;
  name: string;
}

// 一个可拖动的块
const Issue = (props: IssueProps) => {
  const { id, issueIndex, name } = props;
  console.log(
    '一个可拖动的块-Issue-issueIndex==' + issueIndex + ', id== ' + id,
  );

  return (
    <Draggable draggableId={`${id}`} index={issueIndex}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          className={snapshot.isDragging ? styles.issueDragging : styles.issue}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {name}
        </div>
      )}
    </Draggable>
  );
};

// 没一个列表中 处理--
const Column = (props: ColumnProps) => {
  const { columnIndex, activeColumn, column } = props;

  //单个数据对象 id 100   200   300
  const { id, issues } = column;

  return (
    <div className={styles.column}>
      <div className={styles.columnTitle}>
        {column.name}({column.issues.length})
      </div>
      <Droppable
        droppableId={`${columnIndex}`}
        mode="virtual"
        isDropDisabled={
          activeColumn
            ? !(activeColumn.acceptIds.includes(id) || id === activeColumn.id)
            : true
        } //是否能接受拖动
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={
              snapshot.isDraggingOver
                ? styles.columnContentActive
                : styles.columnContent
            }
            {...provided.droppableProps}
          >
            {/*遍历数据列表*/}
            {issues.map((issue, index) => (
              <Issue
                key={issue.id}
                issueIndex={index}
                id={issue.id}
                name={issue.name}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

class Board extends Component {
  static defaultProps = {
    isCombineEnabled: false,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      activeColumn: null,
      data: data,
    };
  }

  onDragStart = (result: DragUpdate) => {
    const data = this.state.data;

    const { source } = result;
    const columnIndex = Number(source.droppableId);
    console.log('--开始拖拽--onDragStart--columnIndex-===' + columnIndex);

    this.setState({
      activeColumn: data[columnIndex],
    });
  };

  onDragEnd = (result: DropResult) => {
    const data = this.state.data;
    console.log('-结束拖拽---------------result===' + JSON.stringify(result));

    const { destination, source } = result;
    if (!destination) {
      return;
    }

    const fromColumnIndex = Number(source.droppableId);
    const fromIssueIndex = source.index;
    const toColumnIndex = Number(destination.droppableId);
    const toIssueIndex = destination.index;

    console.log('-结束拖拽-来源列--fromColumnIndex===' + fromColumnIndex);
    console.log('-结束拖拽-来源索引--fromIssueIndex===' + fromIssueIndex);

    console.log('-结束拖拽-目标列--toColumnIndex===' + toColumnIndex);
    console.log('-结束拖拽-目标索引--toIssueIndex===' + toIssueIndex);

    const TempIssue = data[fromColumnIndex].issues[fromIssueIndex];

    //删除一个拖走的
    let TempData = update(data, {
      [fromColumnIndex]: {
        issues: issues =>
          update(issues, {
            $splice: [[fromIssueIndex, 1]],
          }),
      },
    });

    //增加一个拖来的
    TempData = update(TempData, {
      [toColumnIndex]: {
        issues: issues =>
          update(issues, {
            $splice: [[toIssueIndex, 0, TempIssue]],
          }),
      },
    });

    this.setState({
      data: TempData,
      activeColumn: null,
    });
  };

  render() {
    const data = this.state.data;
    const activeColumn = this.state.activeColumn;

    return (
      <div>
        <DragDropContext
          onDragEnd={this.onDragEnd}
          onDragStart={this.onDragStart}
        >
          <div className={styles.container}>
            {data.map((column, index) => {
              return (
                <Column
                  columnIndex={index}
                  key={column.id}
                  activeColumn={activeColumn}
                  column={column}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>
    );
  }
}

export default () => {
  return (
    <div>
      <Board />
    </div>
  );
};
