import ChatWindow from '@/components/ChatWindow';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat -  ash',
  description: 'Chat with the internet, chat with  ash.',
};

const Home = () => {
  return (
    <div>
      <ChatWindow />
    </div>
  );
};

export default Home;
