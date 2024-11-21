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

export const SkeletonCard: React.FC = () => {
    return (
        <div className="animate-pulse flex flex-col items-center justify-center p-4 border rounded-lg shadow">
            <div className="w-full h-32 bg-gray-300 rounded-md mb-4"></div>
            <div className="w-3/4 h-6 bg-gray-300 rounded-md mb-2"></div>
            <div className="w-1/2 h-6 bg-gray-300 rounded-md"></div>
        </div>
    );
};