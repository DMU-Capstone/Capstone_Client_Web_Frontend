import React, { Component } from 'react';

interface CustomerInfo {
    id: string;
    member_id: string;
    name: string;
    nickname: string;
    business: string;
    create_date: string;
    update_date: string | null;
}

class Customer extends Component<CustomerInfo> {
    render() {
        const {
            id,
            member_id,
            name,
            nickname,
            business,
            create_date,
            update_date
        } = this.props;
        return (
            <div>
                <h2>{id}</h2>
                <h2>{member_id}</h2>
                <h2>{name}</h2>
                <h2>{nickname}</h2>
                <h2>{business}</h2>
                <h2>{create_date}</h2>
                <h2>{update_date || '없데이트'}</h2>
            </div>
        );
    }
}

export default Customer;