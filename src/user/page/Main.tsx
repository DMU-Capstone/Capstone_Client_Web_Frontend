import Header from "../components/Header";

const Main = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold">Main</h1>
        </div>
      </div>
    </div>
  );
};

export default Main;
