export default function UserSearchSkeleton() {
    return (
        <div className={`overflow-hidden flex items-center p-2`}>
            <div className="flex items-center">
                <div className="mr-4">
                    <div className={`overflow-hidden w-10 h-10 bg-gray-300 rounded-full animate-pulse`}></div>
                </div>
                <div className="flex-1">
                    <div className={`overflow-hidden h-4 bg-gray-300 rounded w-32 animate-pulse`}></div>
                </div>
            </div>
        </div>


    );
}