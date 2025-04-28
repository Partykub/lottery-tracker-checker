import Header from './components/Header';
import Home from './pages/Home';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className='w-full'>

          <Home />

      </div>
    </div>
  );
}

export default App;
