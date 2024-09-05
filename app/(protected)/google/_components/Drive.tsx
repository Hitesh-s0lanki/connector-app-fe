

// "use client";

// import { useGetDriveFiles } from "@/actions/features/google.feature";
// import { Input } from "@/components/ui/input";
// import { useState, useEffect } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search } from "lucide-react";

// const Drive = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [fileType, setFileType] = useState<string | undefined>();
//   const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();  // Add folder ID state
//   const driveFilesQuery = useGetDriveFiles(searchQuery, fileType, currentFolderId);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleTabChange = (value: string) => {
//     if (value === "docs") {
//       setFileType("mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'");
//     } else {
//       setFileType(undefined);
//     }
//   };

//   const handleFolderClick = (folderId: string) => {
//     setCurrentFolderId(folderId);  // Set the current folder ID
//   };

//   const handleBackClick = () => {
//     setCurrentFolderId(undefined); // Reset to root folder when back is clicked
//   };

//   useEffect(() => {
//     driveFilesQuery.refetch();
//   }, [searchQuery, fileType, currentFolderId]);



//   const getOwner = (owners) => {
//     if (owners && owners.length > 0) {
//       return owners[0].displayName;
//     }
//     return 'Unknown';
//   };

//   const getLocation = (file) => {
//     if (file.shared) {
//       return 'Shared with me';
//     }
//     if (file.parents && file.parents.length > 0) {
//       return 'My Drive'; // You might want to fetch the actual folder name if needed
//     }
//     return 'My Drive';
//   };



//   if (driveFilesQuery.isError) {
//     return <div>Error: {driveFilesQuery.error.message}</div>;
//   }

//   return (
//     // <div className="h-full w-full grid grid-cols-2 border-r-2">
//     <div className="flex-1 flex flex-col w-full">
//       <div className="h-full w-full flex flex-col gap-5 border-r-2">
//         <Tabs
//           defaultValue="all"
//           className="h-full"
//           onValueChange={(value) => handleTabChange(value)}        >
//           <div className="flex justify-between border-t-2 border-b-2 p-5">
//             <h1 className="font-semibold text-xl">Google Drive</h1>

//             <TabsList className="ml-auto">
//               <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">All files</TabsTrigger>
//               <TabsTrigger value="docs" className="text-zinc-600 dark:text-zinc-200">Documents</TabsTrigger>
             
//             </TabsList>
//           </div>

//           <div className="flex-1 flex flex-col gap-2 h-full p-4">
//             <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
//               <form>
//                 <div className="relative">
//                   <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search"
//                     className="pl-8"
//                     value={searchQuery}
//                     onChange={handleSearchChange}
//                   />
//                 </div>
//               </form>
//             </div>

//             {currentFolderId && (
//               <button onClick={handleBackClick} className="text-blue-600 hover:underline">
//                 Back
//               </button>
//             )}

//             <TabsContent
//               value="all"
//               className="m-0 flex-1 max-h-full overflow-auto"
//             >
//               {driveFilesQuery.isLoading ? (
//                 <div>Loading...</div>
//               ) : (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Name</TableHead>
//                       <TableHead>MIME Type</TableHead>
//                       <TableHead>Owner</TableHead>
//                       <TableHead>Location</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {!driveFilesQuery.data?.message &&
//                       driveFilesQuery.data?.driveFiles?.map((file) => (
//                         <TableRow key={file.id}>
//                           <TableCell>{file.name}</TableCell>
//                           <TableCell>{file.mimeType}</TableCell>
//                           <TableCell>{getOwner(file.owners)}</TableCell>
//                           <TableCell>{getLocation(file)}</TableCell>
//                           <TableCell>
//                             {file.mimeType === "application/vnd.google-apps.folder" ? (
//                               <button
//                                 onClick={() => handleFolderClick(file.id)}
//                                 className="text-blue-600 hover:underline"
//                               >
//                                 Open
//                               </button>
//                             ) : (
//                               <a
//                                 href={file.webViewLink}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-600 hover:underline"
//                               >
//                                 Open
//                               </a>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </TabsContent>
//             <TabsContent value="docs" className="m-0">
//               {driveFilesQuery.isLoading ? (
//                 <div>Loading...</div>
//               ) : (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Name</TableHead>
//                       <TableHead>MIME Type</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {!driveFilesQuery.data?.message &&
//                       driveFilesQuery.data?.driveFiles?.map((file) => (
//                         <TableRow key={file.id}>
//                           <TableCell>{file.name}</TableCell>
//                           <TableCell>{file.mimeType}</TableCell>
//                           <TableCell>{file.owner}</TableCell>
//                           <TableCell>{file.location}</TableCell>
//                           <TableCell>
//                             <a
//                               href={file.webViewLink}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 hover:underline"
//                             >
//                               Open
//                             </a>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </TabsContent>
            
//           </div>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default Drive;

"use client";

import React, { useState, useEffect } from 'react';
import { useGetDriveFiles } from "@/actions/features/google.feature";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

const Drive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fileType, setFileType] = useState<string | undefined>();
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();
  const driveFilesQuery = useGetDriveFiles(searchQuery, fileType, currentFolderId);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case "docs":
        setFileType("mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'");
        break;
      case "pdfs":
        setFileType("mimeType = 'application/pdf'");
        break;
      case "images":
        setFileType("mimeType contains 'image/'");
        break;
      case "spreadsheets":
        setFileType("mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'");
        break;
      default:
        setFileType(undefined);
    }
  };

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleBackClick = () => {
    setCurrentFolderId(undefined);
  };

  useEffect(() => {
    driveFilesQuery.refetch();
  }, [searchQuery, fileType, currentFolderId]);

  const getOwner = (owners) => {
    if (owners && owners.length > 0) {
      return owners[0].displayName;
    }
    return 'Unknown';
  };

  const getLocation = (file) => {
    if (file.shared) {
      return 'Shared with me';
    }
    if (file.parents && file.parents.length > 0) {
      return 'My Drive';
    }
    return 'My Drive';
  };

  if (driveFilesQuery.isError) {
    return <div>Error: {driveFilesQuery.error.message}</div>;
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="h-full w-full flex flex-col gap-5 border-r-2">
        <Tabs
          defaultValue="all"
          className="h-full"
          onValueChange={(value) => handleTabChange(value)}
        >
          <div className="flex justify-between border-t-2 border-b-2 p-5">
            <h1 className="font-semibold text-xl">Google Drive</h1>

            <TabsList className="ml-auto">
              <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">All files</TabsTrigger>
              <TabsTrigger value="docs" className="text-zinc-600 dark:text-zinc-200">Documents</TabsTrigger>
              <TabsTrigger value="pdfs" className="text-zinc-600 dark:text-zinc-200">PDFs</TabsTrigger>
              <TabsTrigger value="images" className="text-zinc-600 dark:text-zinc-200">Images</TabsTrigger>
              <TabsTrigger value="spreadsheets" className="text-zinc-600 dark:text-zinc-200">Spreadsheets</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 flex flex-col gap-2 h-full p-4">
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </form>
            </div>

            {currentFolderId && (
              <button onClick={handleBackClick} className="text-blue-600 hover:underline">
                Back
              </button>
            )}

            {["all", "docs", "pdfs", "images", "spreadsheets"].map((tabValue) => (
              <TabsContent
                key={tabValue}
                value={tabValue}
                className="m-0 flex-1 max-h-full overflow-auto"
              >
                {driveFilesQuery.isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>MIME Type</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!driveFilesQuery.data?.message &&
                        driveFilesQuery.data?.driveFiles?.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell>{file.name}</TableCell>
                            <TableCell>{file.mimeType}</TableCell>
                            <TableCell>{getOwner(file.owners)}</TableCell>
                            <TableCell>{getLocation(file)}</TableCell>
                            <TableCell>
                              {file.mimeType === "application/vnd.google-apps.folder" ? (
                                <button
                                  onClick={() => handleFolderClick(file.id)}
                                  className="text-blue-600 hover:underline"
                                >
                                  Open
                                </button>
                              ) : (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  Open
                                </a>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Drive;