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

const InitialData: initialDataInferface[] = [
  {
    id: 100,
    name: 'todo',
    issues: [
      { id: 1, name: '吃饭' },
      { id: 2, name: '睡觉' },
      { id: 3, name: '打豆豆' },
    ],
    acceptIds: [100, 200, 300], // 拖动权限处理
  },
  {
    id: 200,
    name: 'doing',
    issues: [
      { id: 4, name: '删库' },
      { id: 5, name: '跑路' },
    ],
    acceptIds: [100, 200, 300], // 拖动权限处理
  },
  {
    id: 300,
    name: 'done',
    issues: [],
    acceptIds: [100, 200, 300], // 拖动权限处理
  },
];

for (let i = 6; i < 10; i++) {
  InitialData[0].issues.push({ id: i, name: `uten${i}` });
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

  console.log('---Column------activeColumn==' + JSON.stringify(activeColumn)); // null

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

export default () => {
  const [data, setData] = useState(InitialData);
  const [activeColumn, setActiveColumn] = useState<initialDataInferface | null>(
    null,
  );

  const onDragStart = (result: DragUpdate) => {
    const { source } = result;
    const columnIndex = Number(source.droppableId);
    console.log('--开始拖拽--onDragStart--columnIndex-===' + columnIndex);
    setActiveColumn(data[columnIndex]);
  };

  const onDragEnd = (result: DropResult) => {
    console.log('-结束拖拽---------------result===' + JSON.stringify(result));

    /*
    {
        "draggableId": "2", 
        "type": "DEFAULT", 
        "source": {
            "index": 1, 
            "droppableId": "2"
        }, 
        "reason": "DROP", 
        "mode": "FLUID", 
        "destination": {
            "droppableId": "1", 
            "index": 1
        }, 
        "combine": null
    }
    */
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    const fromColumnIndex = Number(source.droppableId);
    const fromIssueIndex = source.index;
    const toColumnIndex = Number(destination.droppableId);
    const toIssueIndex = destination.index;

    console.log(
      '-结束拖拽-来源列-onDragEnd--fromColumnIndex===' + fromColumnIndex,
    );
    console.log(
      '-结束拖拽-来源索引-onDragEnd---fromIssueIndex===' + fromIssueIndex,
    );

    console.log('-结束拖拽-目标列-onDragEnd--toColumnIndex===' + toColumnIndex);
    console.log(
      '-结束拖拽-目标索引-onDragEnd---toIssueIndex===' + toIssueIndex,
    );

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

    setData(TempData);

    setActiveColumn(null);
  };

  /*
  [
    {
        "id": 100, 
        "name": "todo", 
        "issues": [
            {
                "id": 1, 
                "name": "吃饭"
            }, 
            {
                "id": 2, 
                "name": "睡觉"
            }, 
            {
                "id": 3, 
                "name": "打豆豆"
            }, 
            {
                "id": 6, 
                "name": "uten6"
            }, 
            {
                "id": 7, 
                "name": "uten7"
            }, 
            {
                "id": 8, 
                "name": "uten8"
            }, 
            {
                "id": 9, 
                "name": "uten9"
            }
        ], 
        "acceptIds": [
            200
        ]
    }, 
    {
        "id": 200, 
        "name": "doing", 
        "issues": [
            {
                "id": 4, 
                "name": "删库"
            }, 
            {
                "id": 5, 
                "name": "跑路"
            }
        ], 
        "acceptIds": [
            300
        ]
    }, 
    {
        "id": 300, 
        "name": "done", 
        "issues": [ ], 
        "acceptIds": [
            100, 
            200
        ]
    }
]

  */

  console.log('----222-----data--===' + JSON.stringify(data));
  console.log('----222-----activeColumn--===' + activeColumn); // null

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
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
  );
};
