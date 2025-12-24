import { useDarkMode } from '../[bookingId]/hooks/useDarkMode';

export default function LoadingState() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Loading...</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
