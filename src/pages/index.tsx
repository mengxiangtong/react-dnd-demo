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
        issueItems: [],
      },
      {
        id: 2,
        name: '已备料',
        issueItems: [],
      },
      {
        id: 3,
        name: '未备料',
        issueItems: [],
      },
    ],
    acceptIds: [100, 200],
  },
  {
    id: 200,
    name: 'doing',
    issues: [
      {
        id: 4,
        name: '已完工',
        issueItems: [
          {
            id: 1,
            text: '开始拖的数字',
          },
        ],
      },
      {
        id: 6,
        name: 'uten6',
        issueItems: [
          {
            id: 2,
            text: '结束拖的数字',
          },
        ],
      },
    ],
    acceptIds: [100, 200],
  },

  /*,
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
  },*/
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

// 一个可拖动的条
const Issue = (props: IssueProps) => {
  const { id, issueIndex, name } = props;
  console.log(
    '一个可拖动的条目-Issue-外层issueIndex==' + issueIndex + ', id== ' + id,
  );

  const data = props.data;

  console.log('--大数组---data-' + JSON.stringify(data));

  let issues = data[1].issues;
  //通过id 取出来 每一条的内层数据

  let item = issues.filter(item => {
    return item.id == id;
  })[0];
  console.log('---0000-item--=====' + JSON.stringify(item));
  // item.issueItems
  /*
  {"id":4,"name":"已完工","issueItems":[{"id":1,"text":"开始拖的数字"}]}
  */

  let newID = '';
  if (item && item.issueItems.length != 0) {
    newID = 'mymodel' + id + item.issueItems;
  }

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
          <div className={styles.item0}>AAA</div>

          {/*每一条 horizontal vertical 内部拖拽*/}
          <Droppable droppableId={id} direction="horizontal">
            {provided => (
              <div
                className="modalList"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {/*this.state.modalList.map((item, index) => (
                    <Draggable draggableId={item.name} index={index} key={item.name}>
                      {(provided) => (
                        <div
                          className="modal"
                          key={item.name}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}>
                          <img src={item.imgUrl} alt="" />
                          <span title={item.wording}>{item.wording}</span>
                        </div>
                      )}
                    </Draggable>
                      ))*/}

                {item && item.issueItems && item.issueItems.length != 0 ? (
                  <div>
                    {item.issueItems.map(item0 => {
                      console.log(
                        '----内部---item0---' + JSON.stringify(item0),
                      );
                      return (
                        <Draggable
                          draggableId={'A' + item0.id}
                          index={'A' + item0.id}
                          key={'A' + item0.id}
                        >
                          {provided => (
                            <div
                              //className="modal"
                              key={'222'}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <span
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: 'pink',
                                  marginLeft: '5px',
                                }}
                              >
                                {item0.text + 'A' + item0.id}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                ) : null}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
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

  let is = activeColumn
    ? !(activeColumn.acceptIds.includes(id) || id === activeColumn.id)
    : true;

  if (is) {
    console.log('--------不可拖--');
  } else {
    console.log('-------可拖--');
  }

  console.log('-this.props.data--' + JSON.stringify(props.data));
  //某个包含若干个可拖拽项的组。
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
            ref={provided.innerRef} //整个表格
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
                data={props.data}
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

  /*
  {
    "draggableId": "4222", 
    "type": "DEFAULT", 
    "source": {
        "droppableId": "mymodal", 
        "index": 2
    }, 
    "mode": "FLUID"
}
  */
  onDragStart = (result: DragUpdate) => {
    const data = this.state.data;

    console.log('--开始拖拽--=result===' + JSON.stringify(result));
    console.log('---data-' + JSON.stringify(data));

    /*
    [
    {
        "id": 100, 
        "name": "todo", 
        "issues": [
            {
                "id": 1, 
                "name": "待备料"
            }, 
            {
                "id": 2, 
                "name": "已备料"
            }, 
            {
                "id": 3, 
                "name": "未备料"
            }
        ], 
        "acceptIds": [
            100, 
            200
        ]
    }, 
    {
        "id": 200, 
        "name": "doing", 
        "issues": [
            {
                "id": 4, 
                "name": "已完工"
            }, 
            {
                "id": 6, 
                "name": "uten6"
            }
        ], 
        "acceptIds": [
            100, 
            200
        ]
    }
]
    */

    const { source } = result;

    if (source.droppableId == 'mymodal') {
    } else {
      const columnIndex = Number(source.droppableId);
      console.log('--开始拖拽--onDragStart--columnIndex-===' + columnIndex);

      this.setState({
        activeColumn: data[columnIndex],
      });
    }
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

    console.log('-结束拖拽-目标列--toColumnIndex===' + toColumnIndex); //4
    console.log('-结束拖拽-目标索引--toIssueIndex===' + toIssueIndex); //A1
    let fromIssueIndex_noA = fromIssueIndex.slice(1);
    console.log(
      '-----------------------------------------------------------------',
    );
    console.log('---data-=====' + JSON.stringify(data));

    //取出来 拖走的
    let issues = data[1].issues;
    console.log('----data11-----issues---' + JSON.stringify(issues));
    //根据id 过滤
    let item = issues.filter(item => {
      return item.id == fromColumnIndex;
    })[0];

    console.log('取出来了-item--' + JSON.stringify(item));

    // 取出来了-item--{"id":4,"name":"已完工","issueItems":[{"id":1,"text":"开始拖的数字"}]}

    //拖动的
    //const TempIssue = data[fromColumnIndex].issues[fromIssueIndex];
    let Temp = item.issueItems.filter(item => {
      return item.id == fromIssueIndex_noA;
    })[0];

    console.log('-1111-Temp--' + JSON.stringify(Temp));

    //来源

    console.log('--fromIssueIndex_noA--' + fromIssueIndex_noA);
    //要更新的--去掉的
    let newIssueItems = item.issueItems.filter(item => {
      return item.id != fromIssueIndex_noA;
    });

    item.issueItems = newIssueItems;

    console.log('--更新后 item--' + JSON.stringify(item));
    //--更新后 item--{"id":4,"name":"已完工","issueItems":[]}

    debugger;
    //目标
    let toIssueIndex_noA = toIssueIndex.slice(1);
    //console.log('---data[fromColumnIndex]-=====' + JSON.stringify(data[1][fromColumnIndex]));
    //console.log('-来源列--fromColumnIndex===' + fromColumnIndex);
    //删除一个拖走的

    //根据id 过滤
    let item2 = issues.filter(item => {
      return item.id == toColumnIndex;
    })[0];

    //取出来 新增的老数据组
    item2.issueItems.push(Temp);

    //更新两个
    let dataNew = data;
    let dataItem1 = dataNew[1];

    dataItem1.issues.forEach(i => {
      if (i.id == fromColumnIndex) {
        i = item;
      }
      if (i.id == toColumnIndex) {
        i = item2;
      }
    });

    console.log('--end ------dataItem1---===' + JSON.stringify(dataItem1));
    dataNew[1] = dataItem1;

    //增加一个

    /*
		const TempIssue = data[fromColumnIndex].issues[fromIssueIndex];

		//删除一个拖走的
		let TempData = update(data, {
			[fromColumnIndex]: {
				issues: (issues) =>
					update(issues, {
						$splice: [ [ fromIssueIndex, 1 ] ]
					})
			}
		});

		//增加一个拖来的
		TempData = update(TempData, {
			[toColumnIndex]: {
				issues: (issues) =>
					update(issues, {
						$splice: [ [ toIssueIndex, 0, TempIssue ] ]
					})
			}
		});
*/

    this.setState({
      data: dataNew,
      activeColumn: null,
    });
  };

  render() {
    const data = this.state.data;
    const activeColumn = this.state.activeColumn;

    console.log('--render--data---=====' + JSON.stringify(data));

    //最外层包裹拖拽区域的wrap。
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
                  data={data}
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
