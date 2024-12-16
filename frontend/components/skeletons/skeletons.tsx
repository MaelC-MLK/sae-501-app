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

export function SkeletonEventDetails() {
    return (
        <div className="mt-12">
            <div className="h-80 relative bg-gray-300 animate-pulse"></div>

            <div className="max-w-7xl w-full mt-6 px-10 justify-self-center relative">
                <div className="absolute bg-gray-300 animate-pulse top-0 right-10 text-base hidden md:block w-20 h-6"></div>
                <div className="h-8 bg-gray-300 animate-pulse w-3/4 mb-4"></div>

                <div className="h-6 bg-gray-300 animate-pulse w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 animate-pulse w-full mb-4"></div>

                <div className="flex flex-wrap gap-10 mt-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-6 bg-gray-300 animate-pulse w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-300 animate-pulse w-32"></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-6 bg-gray-300 animate-pulse w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-300 animate-pulse w-32"></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-6 bg-gray-300 animate-pulse w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-300 animate-pulse w-32"></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-6 bg-gray-300 animate-pulse w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-300 animate-pulse w-32"></div>
                    </div>
                </div>

                <div className="my-10">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-6 bg-gray-300 animate-pulse w-20"></div>
                    </div>
                    <div className="flex items-center gap-5 mt-2">
                        <div className="h-10 w-10 bg-gray-300 animate-pulse rounded-full"></div>
                        <div className="flex flex-col">
                            <div className="h-4 bg-gray-300 animate-pulse w-32 mb-1"></div>
                            <div className="h-4 bg-gray-300 animate-pulse w-24"></div>
                        </div>
                    </div>
                </div>

                <div className="mb-16 flex space-x-3">
                    <div className="h-10 w-32 bg-gray-300 animate-pulse rounded-md"></div>
                    <div className="h-10 w-10 bg-gray-300 animate-pulse rounded-md"></div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonProfile() {
  return (
    <div className="min-h-screen p-10 pt-24">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 p-4 bg-primary">
            <div className="flex items-center justify-end gap-3 mb-4">
              <div className="h-10 w-32 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="h-10 w-10 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-gray-300 animate-pulse"></div>
              <div className="mt-4 h-6 w-48 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="mt-2 h-4 w-32 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:w-2/3 p-6">
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="h-10 w-32 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-64 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-144 h-144 bg-primary rounded-full blur-6xl absolute -right-52 -top-64 -z-10" />
    </div>
  );
}

export function SkeletonDraftCard() {
  return (
    <div className="border-2 rounded-xl overflow-hidden py-2 px-4 md:px-10 w-full group bg-background relative h-fit">
      <div className="absolute top-1/2 translate-y-1 sm:-translate-y-1/2 right-6 sm:right-8 z-30 px-1 float-right bg-background">
        <div className="h-10 w-10 bg-gray-300 animate-pulse rounded-md"></div>
      </div>

      <div className="group flex flex-col my-2 w-2/3">
        <div className="h-6 w-48 bg-gray-300 animate-pulse rounded-md mb-2"></div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 md:gap-3 lg:gap-5">
          <div className="flex items-center gap-1 shrink-0">
            <div className="h-4 w-24 bg-gray-300 animate-pulse rounded-md"></div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <div className="h-4 w-24 bg-gray-300 animate-pulse rounded-md"></div>
          </div>
          <div className="flex items-center gap-1 truncate">
            <div className="h-4 w-36 bg-gray-300 animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonPage() {
    return (
      <div className="pt-14">
        <div className="border-b relative overflow-hidden">
          <div className="w-144 h-144 bg-primary rounded-full blur-6xl absolute -right-52 -top-64 -z-10 opacity-30 hidden md:block" />
  
          <div className="flex max-w-7xl justify-self-center w-full overflow-hidden">
            <div className="px-2 md:px-6 py-4 md:py-5 flex items-center gap-2 w-full justify-center md:w-auto md:justify-start font-medium text-sm sm:text-base">
              <div className="h-6 w-24 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
            <div className="px-2 md:px-6 py-4 md:py-5 flex items-center gap-2 w-full justify-center md:w-auto md:justify-start font-medium text-sm sm:text-base">
              <div className="h-6 w-24 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="h-64 bg-gray-300 animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }