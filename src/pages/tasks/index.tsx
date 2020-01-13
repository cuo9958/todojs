import React from "react";
import { Table, Pagination, Button, Input, Message } from "element-react";
import "./index.less";
import request from "../../services/request";
import sdk from "../../services/sdk";

interface iState {
    [index: string]: any;

    list: any[];
    count: number;
    title: string;
}

export default class extends React.Component<any, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            count: 0,
            title: ""
        };
    }
    columns = [
        {
            label: "id",
            prop: "id",
            width: 90
        },
        {
            label: "Todo标题",
            prop: "title"
        },
        {
            label: "通知日期",
            prop: "cron",
            render: (row: any) => {
                return (
                    <div>
                        <div>{row.cron}</div>
                    </div>
                );
            }
        },
        {
            label: "类型",
            prop: "task_type",
            width: 120
        },
        {
            label: "状态",
            prop: "status",
            width: 120,
            render: (row: any) => {
                return row.status === 0 ? "未使用" : "进行中";
            }
        },
        {
            label: "操作",
            width: 180,
            render: (row: any) => {
                return (
                    <Button.Group>
                        <Button onClick={() => this.edit(row.id)} type="primary" size="small">
                            编辑
                        </Button>
                        {row.status === 0 && (
                            <Button onClick={() => this.updateStatus(row.id, 1)} type="success" size="small">
                                启动
                            </Button>
                        )}
                        {row.status === 1 && (
                            <Button onClick={() => this.updateStatus(row.id, 0)} type="warning" size="small">
                                停止
                            </Button>
                        )}
                        <Button onClick={() => this.del(row.id)} type="danger" size="small">
                            删除
                        </Button>
                    </Button.Group>
                );
            }
        }
    ];
    render() {
        return (
            <div id="tasks">
                <div className="search-box">
                    <Input className="input_s" value={this.state.title} onChange={value => this.handleChange("title", value)} placeholder="请输入"></Input>
                    <Button className="search_btn" type="primary" icon="search" onClick={this.handleClick}>
                        搜索
                    </Button>
                    <Button className="add_btn" type="primary" icon="plus" onClick={() => this.addClick()}>
                        新建
                    </Button>
                </div>
                <Table style={{ width: "100%" }} columns={this.columns} data={this.state.list} border={true} />
                <div className="foot">
                    <Pagination onCurrentChange={this.onCurrentChange} layout="prev, pager, next" pageSize={20} small={true} total={this.state.count} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.getList();
    }

    pageIndex = 1;
    async getList(pageIndex?: number) {
        if (pageIndex && !isNaN(pageIndex)) {
            this.pageIndex = pageIndex;
        }
        try {
            const data = await request.get(
                `/task/list?pageIndex=${this.pageIndex}&title=${this.state.title}&platform=${this.state.clientSelect.value}&status=${
                    this.state.statusSelect.value > 1 ? "" : this.state.statusSelect.value
                }`
            );
            this.setState({
                list: data.rows,
                count: data.count
            });
        } catch (error) {
            console.log(error);
        }
    }

    // 搜索框
    handleChange = (key: string, value: any) => {
        this.setState({
            ...this.state,
            [key]: value
        });
    };

    // 搜索框
    handleClick = () => {
        if (!this.state.title) {
            Message({
                message: "请输入任务标题",
                type: "warning"
            });
        }

        this.getList(1);
    };

    addClick() {
       
    }

    edit(id: number) {
       
    }

    async updateStatus(id: number, status: number) {
        if (!sdk.check("app_task_task_status")) return;
        try {
            await request.post("/task/status", { id, status });
            this.getList();
        } catch (e) {
            console.log(e);
            Message.error({
                message: e.message
            });
        }
    }

    async del(id: number) {
        if (!sdk.check("app_task_task_del")) return;
        try {
            await request.post("/task/del", { id });
            this.getList();
        } catch (error) {
            console.log(error);
            Message.error({
                message: error.message
            });
        }
    }
    /**
     * 翻页
     */
    onCurrentChange = (pageIndex: number) => {
        this.getList(pageIndex);
    };
}
