import React from "react";
import { Table, Pagination, Button, Input, Message, Dialog, DatePicker, Select, Form, Checkbox } from "element-react";
import "./index.less";
import request from "../../services/request";
import utils from "../../services/utils";
import SDK from "../../services/sdk";

const time_list: string[] = [];

for (let i = 8; i < 24; i++) {
    const inn = (i + "").padStart(2, "0");
    time_list.push(inn + ":00");
    time_list.push(inn + ":30");
}

interface IForm {
    [index: string]: any;
    id: number;
    title: string;
    last_date: Date;
    to_type: number;
    last_time: string;
    to_count: number;
    tell: string;
    isAll?: boolean;
}

interface iState {
    [index: string]: any;

    list: any[];
    count: number;
    title: string;
    isShow: boolean;
    tmp_time: Date;
    form: IForm;
}

export default class extends React.Component<any, iState> {
    constructor(props: any) {
        super(props);
        const info = SDK.info();
        this.state = {
            list: [],
            count: 0,
            title: "",
            isShow: false,
            tmp_time: new Date(),
            form: {
                id: 0,
                title: "",
                last_date: new Date(),
                last_time: "08:00",
                to_type: 0,
                to_count: 1,
                tell: info.tell || "",
                isAll: false
            }
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
            prop: "last_date",
            width: 160,
            render: (row: any) => {
                return (
                    <div>
                        {row.last_date}&nbsp;
                        {row.last_time}
                    </div>
                );
            }
        },
        {
            label: "次数",
            prop: "to_count",
            width: 70
        },
        {
            label: "程度",
            prop: "to_type",
            width: 70,
            render: (row: any) => {
                if (row.to_type === 0) return "一般";
                if (row.to_type === 1) return "重要";
                if (row.to_type === 2) return "紧急";
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
                                开始
                            </Button>
                        )}
                        {row.status === 1 && (
                            <Button onClick={() => this.updateStatus(row.id, 0)} type="warning" size="small">
                                暂停
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
                    <Input className="input_s" value={this.state.title} onChange={(value: any) => this.updateTitle(value)} placeholder="请输入"></Input>
                    <Button className="search_btn" type="primary" icon="search" onClick={this.handleClick}>
                        搜索
                    </Button>
                    <Button className="add_btn" type="primary" icon="plus" onClick={() => this.addClick()}>
                        新建
                    </Button>
                </div>
                <Table rowClassName={this.rowClassName.bind(this)} style={{ width: "100%" }} columns={this.columns} data={this.state.list} border={true} />
                <div className="foot">
                    <Pagination onCurrentChange={this.onCurrentChange} layout="prev, pager, next" pageSize={20} small={true} total={this.state.count} />
                </div>
                <Dialog title="TODO" size="small" visible={this.state.isShow} onCancel={() => this.setState({ isShow: false })}>
                    <Dialog.Body>
                        <Form>
                            <Form.Item>
                                <Input value={this.state.form.title} placeholder="请输入内容" onChange={e => this.onFormChange("title", e)} />
                            </Form.Item>
                        </Form>
                        <Form inline={true}>
                            <Form.Item>
                                <DatePicker
                                    value={this.state.form.last_date}
                                    placeholder="选择日期"
                                    onChange={date => this.onFormChange("last_date", date)}
                                    disabledDate={(time: Date) => time.getTime() < Date.now() - 8.64e7}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Select value={this.state.form.last_time} placeholder="提醒时间" onChange={e => this.onFormChange("last_time", e)}>
                                    {time_list.map((time, index) => (
                                        <Select.Option key={index} value={time} label={time} />
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                        <Form inline={true}>
                            <Form.Item>
                                <Select value={this.state.form.to_type + ""} placeholder="紧急程度" onChange={e => this.onFormChange("to_type", e * 1)}>
                                    <Select.Option value="0" label="一般" />
                                    <Select.Option value="1" label="重要" />
                                    <Select.Option value="2" label="紧急" />
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Select value={this.state.form.to_count + ""} placeholder="提醒次数" onChange={e => this.onFormChange("to_count", e * 1)}>
                                    <Select.Option value="1" label="1次" />
                                    <Select.Option value="2" label="2次" />
                                    <Select.Option value="3" label="3次" />
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Checkbox onChange={e => this.onFormChange("isAll", e)} checked={this.state.form.isAll}>
                                    通知所有人
                                </Checkbox>
                            </Form.Item>
                        </Form>
                        <Form>
                            <Form.Item>
                                <Input
                                    disabled={this.state.form.isAll}
                                    value={this.state.form.tell}
                                    placeholder="提醒人手机号,分割.ex:156xxxx,132xxxxx"
                                    onChange={e => this.onFormChange("tell", e)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button className="btn_full" type="primary" onClick={() => this.addTodo()}>
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>
                </Dialog>
            </div>
        );
    }

    componentDidMount() {
        this.getList();
    }
    rowClassName(row: any) {
        if (row.status === 0) return "pause";
        if (row.status === 1) return "runing";
        return "";
    }
    pageIndex = 1;
    async getList(pageIndex?: number) {
        if (pageIndex && !isNaN(pageIndex)) {
            this.pageIndex = pageIndex;
        }
        try {
            const data = await request.get("/task/list", {
                pageIndex: this.pageIndex,
                title: this.state.title
            });
            this.setState({
                list: data.rows,
                count: data.count
            });
        } catch (error) {
            console.log(error);
        }
    }

    // 搜索框
    updateTitle = (value: string) => {
        this.setState({
            title: value
        });
    };

    // 搜索框
    handleClick = () => {
        this.getList(1);
    };
    /**
     * 弹层添加todo的对象
     * @param k k
     * @param v v
     */
    onFormChange(k: string, v: any) {
        const model = this.state.form;
        model[k] = v;
        this.setState({ form: model });
    }
    /**
     * 打开添加弹层
     */
    addClick() {
        this.setState({ isShow: true });
    }
    /**
     * 清理弹层数据
     */
    clearForm() {
        this.setState({
            isShow: false,
            form: {
                id: 0,
                title: "",
                last_date: new Date(),
                last_time: "08:30",
                to_count: 1,
                to_type: 0,
                tell: ""
            }
        });
    }
    /**
     * 添加一行todo内容
     */
    async addTodo() {
        const model = Object.assign(this.state.form);
        model.last_date = utils.DateFormart(model.last_date, "yyyy-MM-dd");
        if (model.isAll) {
            model.tell = "";
        }
        console.log("todo", model);
        try {
            await request.post("/task/detail", model);
            Message.success("添加成功");
            this.clearForm();
            this.getList();
        } catch (error) {
            console.log(error);
            Message.error(error.message);
        }
    }

    async edit(id: number) {
        try {
            const data = await request.get("/task/detail", { id });
            this.setState({
                isShow: true,
                form: {
                    id,
                    title: data.title,
                    last_time: data.last_time,
                    last_date: new Date(data.last_date),
                    to_count: data.to_count,
                    to_type: data.to_type,
                    tell: data.tell,
                    isAll: data.is_all === 1 ? true : false
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    async updateStatus(id: number, status: number) {
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
