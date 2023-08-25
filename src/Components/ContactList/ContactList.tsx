
import React, { useEffect, useRef, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, message } from 'antd';
import { useLastChatMessage } from '../../Hooks/ContactList';
import { LogoutApi } from '../../services/auth/Logout';
import { chatController } from '../../services/LayoutApi/chat';
import { Form, Field } from "react-final-form"
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
const { Header, Sider, Content, Footer } = Layout;
const footerStyle: React.CSSProperties = { textAlign: 'center', color: '#fff', backgroundColor: '#111d2c', };
const ContactList: React.FC = () => {
    // DATA get --------------------------------
    const data: any = useLastChatMessage('');

    // usestates -------------------------------
    const [chat, setChat] = useState<number>(1);
    const [id, setId] = useState<any>(null);
    const [collapsed, setCollapsed] = useState(false);
    const [chatData, setChatData] = useState<any>(null);
    const [arr, setArr] = useState<number[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    // submit, click --------------------------->
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    // -----------------------------------------

    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const handleClick = (id: number) => {
        setId(id);
        setChat(id);
        setPage(1)
        const updatedMessageIds: number[] = [];
        chatController.chatByUser(id, 1)
            .then(userChatData => {
                setChatData(userChatData);
                userChatData.results.data.forEach((item: any) => {
                    if (item.admin === null && item.is_new) {
                        updatedMessageIds.push(item.id);
                    }
                });
                setArr(updatedMessageIds);
                scrollToBottom();
            })
    };


    useEffect(() => {
        scrollToBottom();
    }, [chatData]);

    useEffect(() => {
        if (arr.length > 0) {
            chatController.updateMessage(arr);
        }
    }, [arr]);

    // -----------------------------------------
    const onClick = () => { LogoutApi() }
    // -----------------------------------------

    const submit = async (values: any, form: any) => {
        values.message = values.message.trim();
        chatController.addMessage(values.message, chat)
            .then(() => {
                form.change('message', '');
                chatController.chatByUser(chat, page)
                    .then(updatedChatData => {
                        setChatData(updatedChatData);
                    });
            });
    };

    const fetchMoreData = () => {
        if (loadingMore) return; // Prevent multiple simultaneous requests
        setLoadingMore(true);
        const key = "updatable";
        message.loading({ content: "Loading...", key });
        if (id !== null) {
            setTimeout(() => {
                chatController.chatByUser(id, page + 1)
                    .then(userChatData => {
                        if (chatData && userChatData && chatData.results && userChatData.results) {
                            setChatData((prevChatData: any | null) => ({
                                ...prevChatData!,
                                results: {
                                    ...prevChatData!.results,
                                    data: [...prevChatData!.results.data, ...userChatData.results.data],
                                },
                            }));
                            setPage(page + 1);
                            setLoadingMore(false);
                        } else {
                            console.error('Error: Missing chatData or userChatData properties');
                            setLoadingMore(false);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching more data:', error);
                        setLoadingMore(false);
                    });
                    message.success({ content: "Loaded!", key, duration: 2 });
            }, 1000);
        }
    };

    return (
        <Layout>
            <Sider width={400} trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                >
                    {data?.data?.data?.results?.data?.map((item: { last_message: string, unread_messages: number, id: number, user: string, chat_name: string, last_message_time: string }) => (
                        <Menu.Item
                            style={{
                                height: '10%',
                            }}
                            key={item.id}
                            icon={<UserOutlined style={{
                                fontSize: collapsed ? 24 : 30
                            }} />}
                            onClick={() => handleClick(item.id)}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'start', alignSelf: 'center' }}>
                                <div style={{ width: 300, height: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
                                    <h3>{item.chat_name}</h3>
                                    {item.unread_messages !== 0 && (
                                        <p style={{ background: "#4a68ab", fontSize: 12, margin: 0, padding: 0, width: 20, height: 20, borderRadius: "50%", display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>{item.unread_messages}</p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: 300 }}>
                                    <p style={{
                                        fontSize: 12,
                                        paddingLeft: 5,
                                        width: 220,
                                        maxHeight: 30,
                                        lineHeight: 'initial',
                                        overflowX: 'hidden',
                                        whiteSpace: 'normal',
                                    }}>
                                        {item.last_message}
                                    </p>
                                    <p style={{
                                        fontSize: 12,
                                        paddingLeft: 5,
                                        height: 30
                                    }}>
                                        {moment(item.last_message_time).format("HH:mm")}
                                    </p>
                                </div>

                            </div>
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 10, background: colorBgContainer, display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 54,
                            height: 54,
                        }}
                    />
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={onClick}
                        style={{
                            alignItems: 'fle',
                            alignSelf: 'center',
                            fontSize: '16px',
                        }}
                    >Log out</Button>
                </Header>
                <Content
                    style={{
                        margin: '8px 8px',
                        padding: 5,
                        minHeight: id !== null ? 880 : 980,
                        maxHeight: id !== null ? 880 : 980,
                        background: colorBgContainer,
                        display: 'flex',
                        flexDirection: "column",
                        overflowY: 'hidden',
                    }}
                >
                    <div
                        id="scrollableDiv"
                        style={{
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            flex: 1,
                            overflowY: 'auto',
                            padding: '0 10px',
                        }}
                    >
                        <InfiniteScroll
                            dataLength={chatData !== null && chatData.results.data.length}
                            next={fetchMoreData}
                            hasMore={true}
                            inverse={true}
                            loader={< p ></p>}
                            scrollableTarget="scrollableDiv"
                            style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '0 10px', }}
                        >
                            {chatData !== null && chatData?.results?.data?.slice(0).reverse().map((item: any) => (
                                <div
                                    key={item.id}
                                    style={{
                                        background: "#262842",
                                        color: 'white',
                                        borderRadius: '15px',
                                        padding: '10px',
                                        margin: '7px',
                                        alignItems: item.admin !== null ? 'flex-end' : 'flex-start',
                                        alignSelf: item.admin !== null ? 'flex-end' : 'flex-start',
                                        borderBottomRightRadius: item.admin !== null ? "0px" : "15px",
                                        borderBottomLeftRadius: item.admin !== null ? "15px" : "0px"
                                    }}
                                >
                                    {item.text}
                                </div>
                            ))}
                        </InfiniteScroll>
                    </div>
                </Content>
                {
                    id !== null && (
                        <Footer style={footerStyle}>
                            <Form onSubmit={submit}>
                                {({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '10px',
                                            }}
                                        >
                                            <Field
                                                name="message"
                                                component="input"
                                                placeholder="message..."
                                                style={{
                                                    flex: 1,
                                                    border: 'none',
                                                    outline: 'none',
                                                    padding: '8px 10px',
                                                    borderRadius: '20px',
                                                    background: '#f2f3f5',
                                                    marginRight: '10px',
                                                }}
                                            />
                                            <button
                                                type='submit'
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                    background: '#007BFF',
                                                    color: '#fff',
                                                    padding: '8px 20px',
                                                    borderRadius: '20px',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.3s',
                                                }}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </Form>
                        </Footer>
                    )
                }
            </Layout >
        </Layout >
    );
};

export default ContactList;