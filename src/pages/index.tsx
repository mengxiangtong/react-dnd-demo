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
          {
            id: 2,
            text: '开始拖的数字22',
          },
        ],
      },
      {
        id: 5,
        name: 'uten6',
        issueItems: [
          {
            id: 2,
            text: '结束拖的数字',
          },
          {
            id: 3,
            text: '结束拖的数字3',
          },
          {
            id: 4,
            text: '结束拖的数字4',
          },
        ],
      },
    ],
    acceptIds: [100, 200],
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

// 一个可拖动的条
const Issue = (props: IssueProps) => {
  const { id, issueIndex, name } = props;
  console.log(
    '一个可拖动的条目-Issue-外层issueIndex==' + issueIndex + ', id== ' + id,
  );

  const data = [props.todoData, props.doingData];

  console.log('--大数组---data-' + JSON.stringify(data));

  let issues = data[1].issues;
  //通过id 取出来 每一条的内层数据

  let item = issues.filter(item => {
    return item.id == id;
  })[0];
  console.log('---0000-item--=====' + JSON.stringify(item));
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
          <div className={styles.item0}> {name}</div>

          <div className={styles.item0}>AAA</div>

          {/*每一条 horizontal vertical 内部拖拽*/}
          <Droppable droppableId={id} direction="horizontal">
            {provided => (
              <div
                // className="modalList"
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
                  <div
                    //className="issuesStyle"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'nowrap',
                    }}
                  >
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
  const { columnIndex, activeColumn, activeIssue, column } = props;

  //单个数据对象 id 100   200   300
  const { id, issues } = column;

  let is = true;
  console.log('判断条是是否可拖66666--渲染-columnIndex--' + columnIndex);
  if (columnIndex == 'todo') {
    //渲染todo
    if (activeColumn == null) {
      is = true;
    } else {
      is = false;
    }
  } else if (columnIndex == 'doing') {
    //渲染doing
    if (activeColumn == null) {
      is = true;
    } else {
      is = false;
    }
  } else {
    //可拖
    console.log('---activeIssue-------' + JSON.stringify(activeIssue));
    if (activeIssue == null) {
      //长条可拖
      is = false;
      console.log('-------长条可拖-------可拖--');
    } else {
      //长条不可拖
      is = true;
      console.log('--------不可拖---------');
    }
  }

  //console.log('-this.props.data--' + JSON.stringify(props.data));
  //某个包含若干个可拖拽项的组。
  return (
    <div className={styles.column}>
      <div className={styles.columnTitle}>
        {column.name}({column.issues.length})
      </div>
      <Droppable
        droppableId={`${columnIndex}`}
        mode="virtual"
        isDropDisabled={is} //是否能接受拖动
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
                todoData={props.todoData}
                doingData={props.doingData}
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
      activeColumn: null, //拖动的 长条
      activeIssue: null, //拖动的小块
      data: data,
      todoData: {
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
        ],
        acceptIds: [100, 200],
      },
      doingData: {
        id: 200,
        name: 'doing',
        issues: [
          {
            id: 8,
            name: '已完工2',
            issueItems: [
              {
                id: 1,
                text: '开始拖的数字2',
              },
            ],
          },
          {
            id: 4,
            name: '已完工',
            issueItems: [
              {
                id: 2,
                text: '结束拖的数字',
              },
              {
                id: 3,
                text: '结束拖的数字3',
              },
              {
                id: 4,
                text: '结束拖的数字4',
              },
            ],
          },
          {
            id: 5,
            name: 'uten6',
            issueItems: [
              {
                id: 12,
                text: '结束拖的数字',
              },
            ],
          },
        ],
        acceptIds: [100, 200],
      },
    };
  }

  onDragStart = (result: DragUpdate) => {
    const todoData = this.state.todoData;
    const doingData = this.state.doingData;

    console.log('--开始拖拽--=result===' + JSON.stringify(result));

    console.log('--doingData--' + JSON.stringify(doingData));

    const { source } = result;

    if (source.droppableId == 'doing' || source.droppableId == 'todo') {
      if (source.droppableId == 'todo') {
        //拖动左边

        const columnIndex = Number(source.index);
        console.log(
          '--开始拖拽-外层-onDragStart--columnIndex-===' + columnIndex,
        );
        console.log('-666-todoData--' + JSON.stringify(todoData));

        console.log(
          '---6666-todoData.issues[columnIndex] --' +
            JSON.stringify(todoData.issues[columnIndex]),
        );
        //外层
        this.setState({
          activeColumn: todoData.issues[columnIndex],
          activeIssue: null,
        });
      } else if (source.droppableId == 'doing') {
        //拖动右边
        console.log('------拖动右边-----------');
        const columnIndex = Number(source.index);
        console.log(
          '--开始拖拽-外层-onDragStart--columnIndex-===' + columnIndex,
        );
        console.log('-666-doingData--' + JSON.stringify(doingData));

        console.log(
          '---6666-doingData.issues[columnIndex]--' +
            JSON.stringify(doingData.issues[columnIndex]),
        );
        if (doingData.issues[columnIndex]) {
          console.log('----右边选中不空--------');
        } else {
          console.log('-----右边选中不空----------');
        }
        //外层
        this.setState({
          activeColumn: doingData.issues[columnIndex],
          activeIssue: null,
        });
      }
    } else {
      //内层-拖动小块 哪一行
      const columnIndex = Number(source.droppableId);
      console.log(
        '--开始拖拽-内层-拖动小块 哪一行-onDragStart--columnIndex-===' +
          columnIndex,
      );

      console.log('--第几项---source.index --' + source.index);

      let fromIssueIndex_noA = source.index.slice(1);

      //取出当前拖动的块

      const item = doingData.issues.filter(item => {
        return item.id == source.droppableId;
      })[0];

      console.log('----拖动的行--item-===' + JSON.stringify(item));

      const issueItem = item.issueItems.filter(item => {
        return item.id == fromIssueIndex_noA;
      })[0];

      console.log('---拖动小块---issueItem--' + JSON.stringify(issueItem));

      this.setState({
        activeIssue: issueItem,
        activeColumn: null,
      });
    }
  };

  onDragEnd = (result: DropResult) => {
    const todoData = this.state.todoData;
    const doingData = this.state.doingData;

    console.log('-结束拖拽---------------result===' + JSON.stringify(result));

    const { destination, source } = result;
    if (!destination) {
      return;
    }

    const fromColumnIndex = source.droppableId;
    const fromIssueIndex = source.index;
    const toColumnIndex = destination.droppableId;
    const toIssueIndex = destination.index;

    console.log('-结束拖拽-来源列--fromColumnIndex===' + fromColumnIndex);
    console.log('-结束拖拽-来源索引--fromIssueIndex===' + fromIssueIndex);

    console.log('-结束拖拽-目标列--toColumnIndex===' + toColumnIndex); //4
    console.log('-结束拖拽-目标索引--toIssueIndex===' + toIssueIndex); //A1

    if (
      destination.droppableId == 'doing' &&
      source.droppableId != 'todo' &&
      source.droppableId != 'doing'
    ) {
      console.log('----返回--不支持 条内部拖到外部哦-');
      return;
    }

    if (source.droppableId == destination.droppableId) {
      //大表各自内部拖动
      //判断有没有必要内部排序
      if (source.index != destination.index) {
        //排序--拖动的条
        if (source.droppableId == 'doing') {
          let temp = doingData.issues.splice(source.index, 1)[0];
          doingData.issues.splice(destination.index, 0, temp);
          console.log(
            '-排序后的-- doingData.issues-' + JSON.stringify(doingData.issues),
          );
        }
      }
      console.log('----返回--只排序-');
      return;
    }

    if (fromColumnIndex == 'todo') {
      // 外层-- 拖动左边的的条
      let TempIssue = todoData.issues[fromIssueIndex];
      console.log('--TempIssue--' + JSON.stringify(TempIssue));
      //重新分配id
      //取出最大id
      const maxId = Math.max.apply(
        null,
        doingData.issues.map(item => {
          return item.id;
        }),
      );

      console.log('--maxId--' + JSON.stringify(maxId));

      //_tmp和result是相互独立的，没有任何联系，有各自的存储空间。
      let deepClone = function(obj) {
        let _tmp = JSON.stringify(obj); //将对象转换为json字符串形式
        let result = JSON.parse(_tmp); //将转换而来的字符串转换为原生js对象
        return result;
      };

      //深拷贝一份拖动的
      let TempIssue2 = deepClone(TempIssue);

      const idNew = maxId + 1;
      TempIssue2.id = idNew;

      let doingDataNew = this.state.doingData;

      doingDataNew.issues.push(TempIssue2);

      console.log('--doingDataNew--' + JSON.stringify(doingDataNew));

      this.setState({
        doingData: doingDataNew,
        activeColumn: null,
      });
    } else if (fromColumnIndex == 'doing') {
      //外层--从doing 拖到 todo
    } else {
      // 单元格内部拖---拖动小块

      //判断是不是 跨数据行拖动小块
      if (source.droppableId != destination.droppableId) {
        console.log('----返回--跨数据行拖动小块-');
        return;
      }
      let fromIssueIndex_noA = fromIssueIndex.slice(1);
      console.log('fromIssueIndex_noA--' + fromIssueIndex_noA);
      console.log('--doingData-=====' + JSON.stringify(doingData));

      //取出来 拖走的
      let issues = doingData.issues;
      console.log('----data11-----issues---' + JSON.stringify(issues));

      //根据id 过滤------拖的 是这一行里的哦
      let item = issues.filter(item => {
        return item.id == fromColumnIndex;
      })[0];
      console.log('取出来了-item--' + JSON.stringify(item));

      //拖动的
      let Temp = item.issueItems.filter(item => {
        return item.id == fromIssueIndex_noA;
      })[0];

      console.log('-1111-Temp--' + JSON.stringify(Temp));

      //来源
      console.log('--fromIssueIndex_noA--' + fromIssueIndex_noA);
      //要更新的--去掉的--剩余的
      let newIssueItems = item.issueItems.filter(item => {
        return item.id != fromIssueIndex_noA;
      });
      //要更新的--去掉的--拖动的
      let newIssueItems2 = item.issueItems.filter(item => {
        return item.id == fromIssueIndex_noA;
      })[0];
      console.log(
        '-----newIssueItems2---拖动的--' + JSON.stringify(newIssueItems2),
      );
      console.log('-----newIssueItems2---拖动的--' + newIssueItems2.text);

      item.issueItems = newIssueItems; //不要删除

      console.log('--更新后 item--' + JSON.stringify(item));

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

      this.setState({
        data: dataNew,
        //activeColumn: null,
      });
    }

    this.setState({
      activeIssue: null,
      activeColumn: null,
    });
  };

  render() {
    const todoData = this.state.todoData;
    const doingData = this.state.doingData;

    const activeColumn = this.state.activeColumn;

    const data = [todoData, doingData];
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
                  //columnIndex={index}
                  columnIndex={column.name}
                  key={column.id}
                  activeColumn={activeColumn}
                  activeIssue={this.state.activeIssue}
                  column={column}
                  data={data}
                  todoData={todoData}
                  doingData={doingData}
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
