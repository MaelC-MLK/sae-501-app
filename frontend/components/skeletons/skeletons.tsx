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

export function SkeletonCard () {
    return (
        <div className="border-2 rounded-xl overflow-hidden p-2 w-96 group bg-background relative h-fit animate-pulse">
            <div className="absolute top-4 right-4 z-20 gap-1 bg-gray-300 rounded-md w-12 h-6"></div>
            <div className="relative w-full h-52 rounded-xl overflow-hidden bg-gray-300"></div>
            <div className="flex flex-col mt-2">
                <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-2"></div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                        <div className="h-4 bg-gray-300 rounded-md w-60"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export function SkeletonCardCarousel () {
    return (
        <div className="rounded-xl overflow-hidden group relative animate-pulse">
            <div className="absolute top-4 right-4 z-20 gap-1 bg-gray-300 rounded-md w-12 h-6"></div>
            <div className="relative w-full h-52 rounded-xl overflow-hidden bg-gray-300"></div>
            <div className="flex flex-col mt-2">
                <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-2"></div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 shrink-0">
                        <div className="h-5 w-56 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};