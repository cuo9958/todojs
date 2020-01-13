import React from "react";
import io from "socket.io-client";

interface iClient {}

export default class extends React.Component {
    constructor(props: any) {
        super(props);

        const client = io("/", {
            path: "/api_task/socket"
        });
        client.on("connect", function(e: any) {
            console.log(e);
        });
        client.on("event", function(e: any) {
            console.log(e);
        });
        client.on("adw", function(e: any) {
            console.log(e);
        });
        this.client = client;
    }
    client: iClient | null = null;
    render() {
        return <div>404</div>;
    }
}
