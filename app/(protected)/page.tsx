import { getUserData } from "@/actions/user.actions";
import ConnectorList from "./_components/connector-list";
import ErrorPage from "@/components/error-page";

const HomePage = async () => {

  const { user, message } = await getUserData()

  if (message) {
    return <ErrorPage title={message} />
  }

  return (
    <ConnectorList user={user} />
  );
};

export default HomePage;