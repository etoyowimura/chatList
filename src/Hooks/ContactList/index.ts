// Hooks/Chat.ts
import { chatController } from "../../services/LayoutApi/chat";
import { useQuery, useQueryClient } from "react-query";


export const useLastChatMessage = (
  last : any
) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isFetching } = useQuery(
    ['latest-chats/', last],
    () => chatController.lastMessage(last),
    { refetchOnWindowFocus: false }
  );

  return { data, isLoading, refetch, isFetching };
};

export const useChatByUser = (Id: number | string | undefined, page: number): any => {
  return useQuery(
      [`messages/by-chat/${Id || "all"}`, Id],
      () => chatController.chatByUser(Id, page),
      {refetchOnWindowFocus: false}
  );
}
