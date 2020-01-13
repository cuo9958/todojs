import React from "react";
import "./index.less";
import Utils from "../../services/utils";
import { Dropdown, Button } from "element-react";
import { inject } from "mobx-react";

interface iState {
    active: string;
    layout: boolean;
}

interface iProps extends iReactRoute {
    nickname: string;
    check(): void;
    login(): void;
}

@inject((models: any) => ({
    nickname: models.user.nickname,
    check: models.user.check,
    login: models.user.login
}))
export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        const curr = Utils.checkUrl(props.location.pathname);
        this.state = {
            active: curr.name,
            layout: !curr.hideLayout
        };
    }
    render() {
        if (!this.state.layout) return this.props.children;
        return (
            <div>
                <div id="main">
                    <div className="nav">
                        <div id="logo">
                            <a href="/">
                                <img src="https://img1.daling.com/zin/public/specialTopic/2020/01/13/16/39/46/AH2NBU5000004760147.png" alt="" />
                            </a>
                            <a href="/"> TodoJS v1.0</a>
                        </div>
                        <div className="top_menus flex-right">
                            {this.props.nickname && (
                                <Dropdown
                                    trigger="click"
                                    onCommand={this.onCommand}
                                    menu={
                                        <Dropdown.Menu>
                                            <Dropdown.Item command="/login">注销</Dropdown.Item>
                                        </Dropdown.Menu>
                                    }
                                >
                                    <span className="el-dropdown-link">
                                        {this.props.nickname}
                                        <i className="el-icon-caret-bottom el-icon--right"></i>
                                    </span>
                                </Dropdown>
                            )}
                            {!this.props.nickname && (
                                <Button type="primary" size="mini" onClick={() => this.login()}>
                                    登录
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="height40"></div>
                    <div className="continer">{this.props.children}</div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.props.check();
    }
    componentWillReceiveProps(pp: any) {
        const curr = Utils.checkUrl(pp.location.pathname);
        this.props.check();
        this.setState({
            active: curr.name,
            layout: !curr.hideLayout
        });
    }
    onSelect = (index: string) => {
        this.props.history.push(index);
    };

    onCommand = (command: string) => {
        if (command === "/login") {
            return this.login();
        }
        this.props.history.push(command);
    };
    login() {
        this.props.login();
    }
}
