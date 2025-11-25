const NoLinks = () => {
  return (
    <div className="h-full  rounded-xl">
      <div className="text-center py-16 px-6">
        <svg
          className="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          No links yet
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Create your first short link to get started!
        </p>
      </div>
    </div>
  );
};
export default NoLinks;
