import instance from "../api";
import { message } from "antd";

export const chatController = {
  async lastMessage(last : any) {
    try {
      const response = await instance.get('api/v1/latest-chats/');
      const getCount = async () => {
        return 0;
      };
      const count = await getCount();

      return { data: response.data, count: count };
    } catch (error) {
      throw error;
    }
  },
  async updateMessage(message_ids: any) {
    const key = "updatable";
    const { data }: { data: any } = await instance(
      `api/v1/update-messages/`,
      {
        method: "PUT",
        data: {message_ids},
      }
    )
    return data;
  },
  async addMessage(text: any, chat: number) {
    const { data } = await instance("api/v1/message/send/", {
      method: 'POST',
      data: {
        text,
        chat,
      }
    })
    return data;
  },
  async chatByUser(Id: any, page: number) {
    const { data }: { data: any } = await instance(`api/v1/messages/by-chat/${Id}/?page=${page}`);
    return data;
  },
};