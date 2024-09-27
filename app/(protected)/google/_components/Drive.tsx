// "use client";
// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useGetDriveFiles, useGetFolderDetails } from "../../../../actions/features/google.feature";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, FolderIcon, FileIcon } from "lucide-react";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { useToast } from '../../../../components/hooks/use-toast'
// import { getFolderDetails } from '@/actions/google.actions';
// import { Spinner } from '@/components/ui/spinner';

// interface DriveProps {
//   initialFolderId?: string;
// }

// interface FolderDetails {
//   id: string;
//   name: string;
//   parents?: string[];
// }

// const Drive: React.FC<DriveProps> = ({ initialFolderId }) => {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [fileType, setFileType] = useState<string | undefined>();
//   const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(initialFolderId);
//   const [folderHierarchy, setFolderHierarchy] = useState<FolderDetails[]>([]);
  
//   const driveFilesQuery = useGetDriveFiles(searchQuery, fileType, currentFolderId);
//   const folderDetailsQuery = useGetFolderDetails(currentFolderId || '');

//   const buildFolderHierarchy = useCallback(async (folderId: string) => {
//     const hierarchy: FolderDetails[] = [];
//     let currentId = folderId;

//     while (currentId) {
//       try {
//         const folderDetails = await getFolderDetails(currentId);
//         if (folderDetails.folderDetails) {
//           hierarchy.unshift(folderDetails.folderDetails);
//           currentId = folderDetails.folderDetails.parents?.[0];
//         } else {
//           break;
//         }
//       } catch (error) {
//         console.error('Error fetching folder details:', error);
//         break;
//       }
//     }

//     return hierarchy;
//   }, []);

//   useEffect(() => {
//     const initializeFolderHierarchy = async () => {
//       if (initialFolderId) {
//         setCurrentFolderId(initialFolderId);
//         const hierarchy = await buildFolderHierarchy(initialFolderId);
//         setFolderHierarchy(hierarchy);
//       } else {
//         setFolderHierarchy([]);
//       }
//     };

//     initializeFolderHierarchy();
//   }, [initialFolderId, buildFolderHierarchy]);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleTabChange = (value: string) => {
//     switch (value) {
//       case "folders":
//         setFileType("mimeType = 'application/vnd.google-apps.folder'");
//         break;
//       case "docs":
//         setFileType("mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'");
//         break;
//       case "pdfs":
//         setFileType("mimeType = 'application/pdf'");
//         break;
//       case "images":
//         setFileType("mimeType contains 'image/'");
//         break;
//       case "spreadsheets":
//         setFileType("mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'");
//         break;
//       default:
//         setFileType(undefined);
//     }
//   };

//   const handleFolderClick = async (folderId: string) => {
//     try {
//       const newHierarchy = await buildFolderHierarchy(folderId);
//       setCurrentFolderId(folderId);
//       setFolderHierarchy(newHierarchy);
//       router.push(`/google/drive/${folderId}`);
//       driveFilesQuery.refetch(); 
//     } catch (error) {
//       console.error('Failed to navigate to folder:', error);
//       toast({
//         title: "Error",
//         description: "Failed to navigate to the selected folder. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleBackClick = () => {
//     if (folderHierarchy.length > 1) {
//       const newHierarchy = folderHierarchy.slice(0, -1);
//       const parentFolder = newHierarchy[newHierarchy.length - 1];
//       setCurrentFolderId(parentFolder.id);
//       setFolderHierarchy(newHierarchy);
//       router.push(`/google/drive/${parentFolder.id}`);
//     } else {
//       setCurrentFolderId(undefined);
//       setFolderHierarchy([]);
//       router.push('/google/drive');
//     }
//   };

//   // useEffect(() => {
//   //   driveFilesQuery.refetch();
//   // }, [searchQuery, fileType, currentFolderId]);

//   if (driveFilesQuery.isError) {
//     return <div>Error: {driveFilesQuery.error.message}</div>;
//   }

//   const getOwner = (owners: any[]) => {
//     if (owners && owners.length > 0) {
//       return owners[0].displayName;
//     }
//     return 'Unknown';
//   };

//   const getLocation = (file: any) => {
//     if (file.shared) {
//       return 'Shared with me';
//     }
//     if (file.parents && file.parents.length > 0) {
//       return 'My Drive';
//     }
//     return 'My Drive';
//   };
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString();
//   };

//   return (
//     <div className="flex-1 flex flex-col w-full">
//       <div className="flex items-center space-x-2 mb-4">
//         <Input
//           type="text"
//           placeholder="Search files..."
//           value={searchQuery}
//           onChange={handleSearchChange}
//           className="max-w-sm"
//         />
//         <Search className="w-4 h-4 text-gray-500" />
//       </div>

//       <Tabs defaultValue="all" className="mb-4" onValueChange={handleTabChange}>
//         <TabsList>
//           <TabsTrigger value="all">All</TabsTrigger>
//           <TabsTrigger value="folders">Folders</TabsTrigger>
//           <TabsTrigger value="docs">Docs</TabsTrigger>
//           <TabsTrigger value="pdfs">PDFs</TabsTrigger>
//           <TabsTrigger value="images">Images</TabsTrigger>
//           <TabsTrigger value="spreadsheets">Spreadsheets</TabsTrigger>
//         </TabsList>
//       </Tabs>

//       <Breadcrumb className='cursor-pointer mb-4 w-3'>
        
//         {folderHierarchy.map((folder, index) => (
//           <BreadcrumbItem key={folder.id}>
//             <BreadcrumbSeparator />
//             <BreadcrumbLink
//               onClick={() => index < folderHierarchy.length - 1 && handleFolderClick(folder.id)}
//             >
//               {folder.name}
//             </BreadcrumbLink>
//           </BreadcrumbItem>
//         ))}
//       </Breadcrumb>

//       {driveFilesQuery.isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <Spinner />
//         </div>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Owner</TableHead>
//               <TableHead>Last Modified</TableHead>
//               <TableHead>Location</TableHead>            
//             </TableRow>
//           </TableHeader>
//           <TableBody className=''>
//             {driveFilesQuery.data?.driveFiles?.map((file) => (
//               <TableRow key={file.id} className="font-medium hover:text-blue-600" >
//                 <TableCell >
//                   {file.mimeType === 'application/vnd.google-apps.folder' ? (
//                     <div className="flex items-center cursor-pointer" onClick={() => handleFolderClick(file.id)}>
//                       <FolderIcon className="mr-2" />
//                       {file.name}
//                     </div>
//                   ) : (
//                     <div className="flex items-center">
//                       <FileIcon className="mr-2" />
//                       {file.name}
//                     </div>
//                   )}
//                 </TableCell>
//                 <TableCell className='hover:text-blue-600'>{getOwner(file.owners)}</TableCell>
//                 <TableCell className='hover:text-blue-600'>{formatDate(file.modifiedTime)}</TableCell>
//                 <TableCell className='hover:text-blue-600'>{getLocation(file)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default Drive;



// "use client";


// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useGetDriveFiles, useGetFolderDetails } from "../../../../actions/features/google.feature";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, FolderIcon, FileIcon, ChevronLeft } from "lucide-react";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { useToast } from '../../../../components/hooks/use-toast';
// import { getFolderDetails } from '@/actions/google.actions';
// import { Spinner } from '@/components/ui/spinner';
// import { Button } from '@/components/ui/button';

// interface DriveProps {
//   initialFolderId?: string;
// }

// interface FolderDetails {
//   id: string;
//   name: string;
//   parents?: string[];
// }

// const Drive: React.FC<DriveProps> = ({ initialFolderId }) => {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [fileType, setFileType] = useState<string | undefined>();
//   const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(initialFolderId);
//   const [folderHierarchy, setFolderHierarchy] = useState<FolderDetails[]>([]);
  
//   const driveFilesQuery = useGetDriveFiles(searchQuery, fileType, currentFolderId);
//   const folderDetailsQuery = useGetFolderDetails(currentFolderId || '');

//   const buildFolderHierarchy = useCallback(async (folderId: string) => {
//     const hierarchy: FolderDetails[] = [];
//     let currentId = folderId;

//     while (currentId) {
//       try {
//         const folderDetails = await getFolderDetails(currentId);
//         if (folderDetails.folderDetails) {
//           hierarchy.unshift(folderDetails.folderDetails);
//           currentId = folderDetails.folderDetails.parents?.[0];
//         } else {
//           break;
//         }
//       } catch (error) {
//         console.error('Error fetching folder details:', error);
//         break;
//       }
//     }

//     return hierarchy;
//   }, []);

//   useEffect(() => {
//     const initializeFolderHierarchy = async () => {
//       if (initialFolderId) {
//         setCurrentFolderId(initialFolderId);
//         const hierarchy = await buildFolderHierarchy(initialFolderId);
//         setFolderHierarchy(hierarchy);
//       } else {
//         setFolderHierarchy([]);
//       }
//     };

//     initializeFolderHierarchy();
//   }, [initialFolderId, buildFolderHierarchy]);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleTabChange = (value: string) => {
//     switch (value) {
//       case "all":
//         setFileType("mimeType != 'application/vnd.google-apps.folder'");
//         break;
//       case "folders":
//         setFileType("mimeType = 'application/vnd.google-apps.folder'");
//         break;
//       case "docs":
//         setFileType("mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'");
//         break;
//       case "pdfs":
//         setFileType("mimeType = 'application/pdf'");
//         break;
//       case "images":
//         setFileType("mimeType contains 'image/'");
//         break;
//       case "spreadsheets":
//         setFileType("mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'");
//         break;
//       default:
//         setFileType(undefined);
//     }
//   };

//   const handleFolderClick = async (folderId: string) => {
//     try {
//       const newHierarchy = await buildFolderHierarchy(folderId);
//       setCurrentFolderId(folderId);
//       setFolderHierarchy(newHierarchy);
//       router.push(`/google/drive/${folderId}`);
//       driveFilesQuery.refetch(); 
//     } catch (error) {
//       console.error('Failed to navigate to folder:', error);
//       toast({
//         title: "Error",
//         description: "Failed to navigate to the selected folder. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleBackClick = () => {
//     if (folderHierarchy.length > 1) {
//       const newHierarchy = folderHierarchy.slice(0, -1);
//       const parentFolder = newHierarchy[newHierarchy.length - 1];
//       setCurrentFolderId(parentFolder.id);
//       setFolderHierarchy(newHierarchy);
//       router.push(`/google/drive/${parentFolder.id}`);
//     } else {
//       setCurrentFolderId(undefined);
//       setFolderHierarchy([]);
//       router.push('/google/drive');
//     }
//   };

//   if (driveFilesQuery.isError) {
//     return <div>Error: {driveFilesQuery.error.message}</div>;
//   }

//   const getOwner = (owners: any[]) => {
//     if (owners && owners.length > 0) {
//       return owners[0].displayName;
//     }
//     return 'Unknown';
//   };

//   const getLocation = (file: any) => {
//     if (file.shared) {
//       return 'Shared with me';
//     }
//     if (file.parents && file.parents.length > 0) {
//       return 'My Drive';
//     }
//     return 'My Drive';
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString();
//   };

//   return (
//     <div className="flex-1 flex flex-col w-full">
//       <div className="flex flex-col items-center space-y-4 mb-4">
//         <div className="flex items-center space-x-2 max-w-md w-full">
//           <Input
//             type="text"
//             placeholder="Search files..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="flex-grow"
//           />
//           <Search className="w-4 h-4 text-gray-500" />
//         </div>
//         <Tabs defaultValue="all" className="w-full max-w-md" onValueChange={handleTabChange}>
//           <TabsList className="grid w-full grid-cols-6">
//             <TabsTrigger value="all">All</TabsTrigger>
//             <TabsTrigger value="folders">Folders</TabsTrigger>
//             <TabsTrigger value="docs">Docs</TabsTrigger>
//             <TabsTrigger value="pdfs">PDFs</TabsTrigger>
//             <TabsTrigger value="images">Images</TabsTrigger>
//             <TabsTrigger value="spreadsheets">Sheets</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       <div className="flex items-center mb-4">
//         <Button variant="ghost" onClick={handleBackClick} disabled={folderHierarchy.length === 0}>
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//         <Breadcrumb className="ml-4">
//           {folderHierarchy.map((folder, index) => (
//             <BreadcrumbItem key={folder.id}>
//               <BreadcrumbLink
//                 onClick={() => index < folderHierarchy.length - 1 && handleFolderClick(folder.id)}
//               >
//                 {folder.name}
//               </BreadcrumbLink>
//               {index < folderHierarchy.length - 1 && <BreadcrumbSeparator />}
//             </BreadcrumbItem>
//           ))}
//         </Breadcrumb>
//       </div>

//       {driveFilesQuery.isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <Spinner />
//         </div>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Owner</TableHead>
//               <TableHead>Last Modified</TableHead>
//               <TableHead>Location</TableHead>            
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {driveFilesQuery.data?.driveFiles?.map((file) => (
//               <TableRow key={file.id} className="font-medium">
//                 <TableCell>
//                   {file.mimeType === 'application/vnd.google-apps.folder' ? (
//                     <div className="flex items-center cursor-pointer" onClick={() => handleFolderClick(file.id)}>
//                       <FolderIcon className="mr-2" />
//                       {file.name}
//                     </div>
//                   ) : (
//                     <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600">
//                       <FileIcon className="mr-2" />
//                       {file.name}
//                     </a>
//                   )}
//                 </TableCell>
//                 <TableCell>{getOwner(file.owners)}</TableCell>
//                 <TableCell>{formatDate(file.modifiedTime)}</TableCell>
//                 <TableCell>{getLocation(file)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default Drive;

// "use client"

// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useGetDriveFiles, useGetFolderDetails } from "../../../../actions/features/google.feature";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, FolderIcon, FileIcon, ChevronLeft } from "lucide-react";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { useToast } from '../../../../components/hooks/use-toast';
// import { getFolderDetails } from '@/actions/google.actions';
// import { Spinner } from '@/components/ui/spinner';
// import { Button } from '@/components/ui/button';

// interface DriveProps {
//   initialFolderId?: string;
// }

// interface FolderDetails {
//   id: string;
//   name: string;
//   parents?: string[];
// }

// const Drive: React.FC<DriveProps> = ({ initialFolderId }) => {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [fileType, setFileType] = useState<string | undefined>();
//   const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(initialFolderId);
//   const [folderHierarchy, setFolderHierarchy] = useState<FolderDetails[]>([]);
//   const [currentView, setCurrentView] = useState("all");
  
//   const driveFilesQuery = useGetDriveFiles(searchQuery, fileType, currentFolderId);
//   const folderDetailsQuery = useGetFolderDetails(currentFolderId || '');

//   const buildFolderHierarchy = useCallback(async (folderId: string) => {
//     const hierarchy: FolderDetails[] = [];
//     let currentId = folderId;

//     while (currentId) {
//       try {
//         const folderDetails = await getFolderDetails(currentId);
//         if (folderDetails.folderDetails) {
//           hierarchy.unshift(folderDetails.folderDetails);
//           currentId = folderDetails.folderDetails.parents?.[0];
//         } else {
//           break;
//         }
//       } catch (error) {
//         console.error('Error fetching folder details:', error);
//         break;
//       }
//     }

//     return hierarchy;
//   }, []);

//   useEffect(() => {
//     const initializeFolderHierarchy = async () => {
//       if (initialFolderId) {
//         setCurrentFolderId(initialFolderId);
//         const hierarchy = await buildFolderHierarchy(initialFolderId);
//         setFolderHierarchy(hierarchy);
//       } else {
//         setFolderHierarchy([]);
//       }
//     };

//     initializeFolderHierarchy();
//   }, [initialFolderId, buildFolderHierarchy]);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleTabChange = (value: string) => {
//     setCurrentView(value);
//     switch (value) {
//       case "all":
//         setFileType(undefined);
//         break;
//       case "folders":
//         setFileType("mimeType = 'application/vnd.google-apps.folder'");
//         break;
//       case "docs":
//         setFileType("mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'");
//         break;
//       case "pdfs":
//         setFileType("mimeType = 'application/pdf'");
//         break;
//       case "images":
//         setFileType("mimeType contains 'image/'");
//         break;
//       case "spreadsheets":
//         setFileType("mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'");
//         break;
//       default:
//         setFileType(undefined);
//     }
//   };

//   const handleFolderClick = async (folderId: string) => {
//     try {
//       const newHierarchy = await buildFolderHierarchy(folderId);
//       setCurrentFolderId(folderId);
//       setFolderHierarchy(newHierarchy);
//       router.push(`/google/drive/${folderId}`);
//       driveFilesQuery.refetch(); 
//     } catch (error) {
//       console.error('Failed to navigate to folder:', error);
//       toast({
//         title: "Error",
//         description: "Failed to navigate to the selected folder. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleBackClick = () => {
//     if (folderHierarchy.length > 1) {
//       const newHierarchy = folderHierarchy.slice(0, -1);
//       const parentFolder = newHierarchy[newHierarchy.length - 1];
//       setCurrentFolderId(parentFolder.id);
//       setFolderHierarchy(newHierarchy);
//       router.push(`/google/drive/${parentFolder.id}`);
//       driveFilesQuery.refetch();
//     } else {
//       setCurrentFolderId(undefined);
//       setFolderHierarchy([]);
//       router.push('/google/drive');
//       driveFilesQuery.refetch();
//     }
//   };

//   if (driveFilesQuery.isError) {
//     return <div>Error: {driveFilesQuery.error.message}</div>;
//   }

//   const getOwner = (owners: any[]) => {
//     if (owners && owners.length > 0) {
//       return owners[0].displayName;
//     }
//     return 'Unknown';
//   };

//   const getLocation = (file: any) => {
//     if (file.shared) {
//       return 'Shared with me';
//     }
//     if (file.parents && file.parents.length > 0) {
//       return 'My Drive';
//     }
//     return 'My Drive';
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString();
//   };

//   const filteredFiles = driveFilesQuery.data?.driveFiles?.filter(file => {
//     if (currentView === "all") {
//       return file.mimeType !== 'application/vnd.google-apps.folder';
//     }
//     return true;
//   });

//   return (
//     <div className="flex-1 flex flex-col w-full">
//       <div className="flex flex-col items-center space-y-4 mb-4">
//         <div className="flex items-center space-x-2 max-w-md w-full">
//           <Input
//             type="text"
//             placeholder="Search files..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="flex-grow"
//           />
//           <Search className="w-4 h-4 text-gray-500" />
//         </div>
//         <Tabs defaultValue="all" className="w-full max-w-md" onValueChange={handleTabChange}>
//           <TabsList className="grid w-full grid-cols-6">
//             <TabsTrigger value="all">All</TabsTrigger>
//             <TabsTrigger value="folders">Folders</TabsTrigger>
//             <TabsTrigger value="docs">Docs</TabsTrigger>
//             <TabsTrigger value="pdfs">PDFs</TabsTrigger>
//             <TabsTrigger value="images">Images</TabsTrigger>
//             <TabsTrigger value="spreadsheets">Sheets</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       {/* <div className="flex items-center mb-4">
//         <Button variant="ghost" onClick={handleBackClick} disabled={folderHierarchy.length === 0}>
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//         <Breadcrumb className="ml-4">
//           {folderHierarchy.map((folder, index) => (
//             <BreadcrumbItem key={folder.id}>
//               <BreadcrumbLink
//                 onClick={() => index < folderHierarchy.length - 1 && handleFolderClick(folder.id)}
//               >
//                 {folder.name}
//               </BreadcrumbLink>
//               {index < folderHierarchy.length - 1 && <BreadcrumbSeparator />}
//             </BreadcrumbItem>
//           ))}
//         </Breadcrumb>
//       </div> */}
//       <div className="flex items-center space-x-2 mb-4">
//         <Button variant="ghost" onClick={handleBackClick} disabled={folderHierarchy.length === 0}>
//           <ChevronLeft className="w-4 h-4" />
//         </Button>
//         <Breadcrumb className="truncate">
//           {folderHierarchy.map((folder, index) => (
//             <BreadcrumbItem key={folder.id} isCurrentPage={index === folderHierarchy.length - 1}>
//               <BreadcrumbLink
//                 href="#"
//                 onClick={() => handleFolderClick(folder.id)}
//               >
//                 {folder.name}
//               </BreadcrumbLink>
//               {index < folderHierarchy.length - 1 && <BreadcrumbSeparator />}
//             </BreadcrumbItem>
//           ))}
//         </Breadcrumb>
//       </div>

//       {driveFilesQuery.isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <Spinner />
//         </div>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Owner</TableHead>
//               <TableHead>Last Modified</TableHead>
//               <TableHead>Location</TableHead>            
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredFiles?.map((file) => (
//               <TableRow key={file.id} className="font-medium">
//                 <TableCell>
//                   {file.mimeType === 'application/vnd.google-apps.folder' ? (
//                     <div className="flex items-center cursor-pointer" onClick={() => handleFolderClick(file.id)}>
//                       <FolderIcon className="mr-2" />
//                       {file.name}
//                     </div>
//                   ) : (
//                     <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600">
//                       <FileIcon className="mr-2" />
//                       {file.name}
//                     </a>
//                   )}
//                 </TableCell>
//                 <TableCell>{getOwner(file.owners)}</TableCell>
//                 <TableCell>{formatDate(file.modifiedTime)}</TableCell>
//                 <TableCell>{getLocation(file)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default Drive;




// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useGetDriveFiles, useGetFolderDetails } from "../../../../actions/features/google.feature";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, FolderIcon, FileIcon, ChevronLeft } from "lucide-react";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { useToast } from '../../../../components/hooks/use-toast';
// import { getFolderDetails } from '@/actions/google.actions';
// import { Spinner } from '@/components/ui/spinner';
// import { Button } from '@/components/ui/button';

// interface DriveProps {
//   initialFolderId?: string;
// }

// interface FolderDetails {
//   id: string;
//   name: string;
//   parents?: string[];
// }

// const Drive: React.FC<DriveProps> = ({ initialFolderId }) => {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [fileType, setFileType] = useState<string | undefined>();
//   const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(initialFolderId);
//   const [folderHierarchy, setFolderHierarchy] = useState<FolderDetails[]>([]);
//   const [currentView, setCurrentView] = useState("all");
//   const [isNavigating, setIsNavigating] = useState(false);
//   const [currentFolderData, setCurrentFolderData] = useState<FolderDetails | null>(null);

//   const driveFilesQuery = useGetDriveFiles(searchQuery, fileType, currentFolderId);
//   const folderDetailsQuery = useGetFolderDetails(currentFolderId || '');

//   useEffect(() => {
//     console.log('Current Folder ID:', currentFolderId);
//     console.log('Folder Hierarchy:', folderHierarchy);
//   }, [currentFolderId, folderHierarchy]);

//   useEffect(() => {
//     console.log('Drive Files Query Data:', driveFilesQuery.data);
//     console.log('Drive Files Query Error:', driveFilesQuery.error);
//     console.log('Drive Files Query Loading:', driveFilesQuery.isLoading);
//   }, [driveFilesQuery.data, driveFilesQuery.error, driveFilesQuery.isLoading]);

//   const buildFolderHierarchy = useCallback(async (folderId: string) => {
//     const hierarchy: FolderDetails[] = [];
//     let currentId = folderId;

//     while (currentId) {
//       try {
//         const folderDetails = await getFolderDetails(currentId);
//         if (folderDetails.folderDetails) {
//           hierarchy.unshift(folderDetails.folderDetails);
//           currentId = folderDetails.folderDetails.parents?.[0];
//         } else {
//           break;
//         }
//       } catch (error) {
//         console.error('Error fetching folder details:', error);
//         break;
//       }
//     }

//     return hierarchy;
//   }, []);

//   useEffect(() => {
//     const initializeFolderHierarchy = async () => {
//       if (initialFolderId) {
//         setCurrentFolderId(initialFolderId);
//         const hierarchy = await buildFolderHierarchy(initialFolderId);
//         setFolderHierarchy(hierarchy);

//         // New changes 
//         setCurrentFolderData(hierarchy[hierarchy.length - 1]);
      
      
//       } else {
//         setFolderHierarchy([]);
//         setCurrentFolderData(null);

//       }
//     };

//     initializeFolderHierarchy();
//   }, [initialFolderId, buildFolderHierarchy]);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleTabChange = (value: string) => {
//     setCurrentView(value);
//     switch (value) {
//       case "all":
//         setFileType(undefined);
//         break;
//       case "folders":
//         setFileType("mimeType = 'application/vnd.google-apps.folder'");
//         break;
//       case "docs":
//         setFileType("mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'");
//         break;
//       case "pdfs":
//         setFileType("mimeType = 'application/pdf'");
//         break;
//       case "images":
//         setFileType("mimeType contains 'image/'");
//         break;
//       case "spreadsheets":
//         setFileType("mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'");
//         break;
//       default:
//         setFileType(undefined);
//     }
//   };

 
//   const handleFolderClick = useCallback(async (folderId: string) => {
//     if (isNavigating) return;
//     setIsNavigating(true);
//     try {
//       setCurrentFolderId(folderId);
//       const newHierarchy = await buildFolderHierarchy(folderId);
//       console.log('New Hierarchy:', newHierarchy);
//       setFolderHierarchy(newHierarchy);
//       setCurrentFolderData(newHierarchy[newHierarchy.length - 1]);
//       router.push(`/google/drive/${folderId}`, undefined, { shallow: true });
//       await driveFilesQuery.refetch();
//       console.log('Refetched Drive Files');
//     } catch (error) {
//       console.error('Failed to navigate to folder:', error);
//       toast({
//         title: "Error",
//         description: "Failed to navigate to the selected folder. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsNavigating(false);
//     }
//   }, [isNavigating, buildFolderHierarchy, router, driveFilesQuery, toast]);

//   const handleBackClick = async () => {
//     if (isNavigating) return;
//     setIsNavigating(true);
//     if (folderHierarchy.length > 1) {
//       const newHierarchy = folderHierarchy.slice(0, -1);
//       const parentFolder = newHierarchy[newHierarchy.length - 1];
//       setCurrentFolderId(parentFolder.id);
//       setFolderHierarchy(newHierarchy);

//       // New Chnages:
//       setCurrentFolderData(parentFolder);

//       router.push(`/google/drive/${parentFolder.id}`);
//       await driveFilesQuery.refetch();
//     } else {
//       setCurrentFolderId(undefined);
//       setFolderHierarchy([]);
//       router.push('/google/drive');
//       await driveFilesQuery.refetch();
//     }
//     setIsNavigating(false);
//   };

//   if (driveFilesQuery.isError) {
//     return <div>Error: {driveFilesQuery.error.message}</div>;
//   }

//   const getOwner = (owners: any[]) => {
//     if (owners && owners.length > 0) {
//       return owners[0].displayName;
//     }
//     return 'Unknown';
//   };

//   const getLocation = (file: any) => {
//     if (file.shared) {
//       return 'Shared with me';
//     }
//     if (file.parents && file.parents.length > 0) {
//       return 'My Drive';
//     }
//     return 'My Drive';
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString();
//   };

//   const filteredFiles = driveFilesQuery.data?.driveFiles?.filter(file => {
//     if (currentView === "all") {
//       return file.mimeType !== 'application/vnd.google-apps.folder';
//     }
//     return true;
//   });

//   return (
//     <div className="flex-1 flex flex-col w-full">
//       <div className="flex flex-col items-center space-y-4 mb-4">
//         <div className="flex items-center space-x-2 max-w-md w-full">
//           <Input
//             type="text"
//             placeholder="Search files..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="flex-grow"
//           />
//           <Search className="w-4 h-4 text-gray-500" />
//         </div>
//         <Tabs defaultValue="all" className="w-full max-w-md" onValueChange={handleTabChange}>
//           <TabsList className="grid w-full grid-cols-6">
//             <TabsTrigger value="all">All</TabsTrigger>
//             <TabsTrigger value="folders">Folders</TabsTrigger>
//             <TabsTrigger value="docs">Docs</TabsTrigger>
//             <TabsTrigger value="pdfs">PDFs</TabsTrigger>
//             <TabsTrigger value="images">Images</TabsTrigger>
//             <TabsTrigger value="spreadsheets">Sheets</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       {/* <div className="flex items-center mb-4">
//         <Button variant="ghost" onClick={handleBackClick} disabled={folderHierarchy.length === 0}>
//           <ChevronLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//         <Breadcrumb className="ml-4">
//           {folderHierarchy.map((folder, index) => (
//             <BreadcrumbItem key={folder.id}>
//               <BreadcrumbLink
//                 onClick={() => index < folderHierarchy.length - 1 && handleFolderClick(folder.id)}
//               >
//                 {folder.name}
//               </BreadcrumbLink>
//               {index < folderHierarchy.length - 1 && <BreadcrumbSeparator />}
//             </BreadcrumbItem>
//           ))}
//         </Breadcrumb>
//       </div> */}
//       <div className="flex items-center space-x-2 mb-4">
//         <Button variant="ghost" onClick={handleBackClick} disabled={folderHierarchy.length === 0 || isNavigating}>
//           <ChevronLeft className="w-4 h-4" />
//         </Button>
//         <Breadcrumb className="truncate">
//           {folderHierarchy.map((folder, index) => (
//             <BreadcrumbItem key={folder.id} isCurrentPage={index === folderHierarchy.length - 1}>
//               <BreadcrumbLink
//                 href="#"
//                 onClick={() => !isNavigating && handleFolderClick(folder.id)}
//               >
//                 {folder.name}
//               </BreadcrumbLink>
//               {index < folderHierarchy.length - 1 && <BreadcrumbSeparator />}
//             </BreadcrumbItem>
//           ))}
//         </Breadcrumb>
//       </div>

//       {driveFilesQuery.isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <Spinner />
//         </div>
//       ) : driveFilesQuery.isError ? (
//       <div>Error loading files: {driveFilesQuery.error.message}</div>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Owner</TableHead>
//               <TableHead>Last Modified</TableHead>
//               <TableHead>Location</TableHead>            
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredFiles?.length > 0 ? ( 
//               filteredFiles?.map((file) => (
//               <TableRow key={file.id} className="font-medium">
//                 <TableCell>
//                   {file.mimeType === 'application/vnd.google-apps.folder' ? (
//                     <div className="flex items-center cursor-pointer" onClick={() => handleFolderClick(file.id)}>
//                       <FolderIcon className="mr-2" />
//                       {file.name}
//                     </div>
//                   ) : (
//                     <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600">
//                       <FileIcon className="mr-2" />
//                       {file.name}
//                     </a>
//                   )}
//                 </TableCell>
//                 <TableCell>{getOwner(file.owners)}</TableCell>
//                 <TableCell>{formatDate(file.modifiedTime)}</TableCell>
//                 <TableCell>{getLocation(file)}</TableCell>
//               </TableRow>
//             ))) : (
//               <TableRow>
//               <TableCell colSpan={4} className="text-center">No files found in this folder.</TableCell>
//             </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default Drive;



 // const handleFolderClick = async (folderId: string) => {
  //   try {
  //     const newHierarchy = await buildFolderHierarchy(folderId);
  //     setCurrentFolderId(folderId);
  //     setFolderHierarchy(newHierarchy);
  //     router.push(`/google/drive/${folderId}`);
  //     driveFilesQuery.refetch(); 
  //   } catch (error) {
  //     console.error('Failed to navigate to folder:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to navigate to the selected folder. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };
  // const handleFolderClick = async (folderId: string) => {
  //   if (isNavigating) return;
  //   setIsNavigating(true);
  //   try {
  //     const newHierarchy = await buildFolderHierarchy(folderId);
  //     setCurrentFolderId(folderId);
  //     setFolderHierarchy(newHierarchy);

  //     // New Changes
  //     setCurrentFolderData(newHierarchy[newHierarchy.length - 1]);
  //     router.push(`/google/drive/${folderId}`);
  //     // await driveFilesQuery.refetch();
  //     // router.push(`/google/drive/${folderId}`);
  //     await driveFilesQuery.refetch();
  //   } catch (error) {
  //     console.error('Failed to navigate to folder:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to navigate to the selected folder. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsNavigating(false);
  //   }
  // };


"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGetDriveFiles, useGetFolderDetails } from "../../../../actions/features/google.feature";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FolderIcon, FileIcon, ChevronLeft } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useToast } from '../../../../components/hooks/use-toast';
import { getFolderDetails } from '@/actions/google.actions';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

interface DriveProps {
  initialFolderId?: string;
}

interface FolderDetails {
  id: string;
  name: string;
  parents?: string[];
}

const Drive: React.FC<DriveProps> = ({ initialFolderId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [fileType, setFileType] = useState<string | undefined>();
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(initialFolderId);
  const [folderHierarchy, setFolderHierarchy] = useState<FolderDetails[]>([]);
  const [currentView, setCurrentView] = useState("all");
  const [isNavigating, setIsNavigating] = useState(false);

  const driveFilesQuery = useGetDriveFiles(searchQuery, fileType, currentFolderId);
  const folderDetailsQuery = useGetFolderDetails(currentFolderId || '');

  const buildFolderHierarchy = useCallback(async (folderId: string) => {
    const hierarchy: FolderDetails[] = [];
    let currentId = folderId;

    while (currentId) {
      try {
        const folderDetails = await getFolderDetails(currentId);
        if (folderDetails.folderDetails) {
          hierarchy.unshift(folderDetails.folderDetails);
          currentId = folderDetails.folderDetails.parents?.[0];
        } else {
          break;
        }
      } catch (error) {
        console.error('Error fetching folder details:', error);
        break;
      }
    }

    return hierarchy;
  }, []);

  useEffect(() => {
    const initializeFolderHierarchy = async () => {
      if (initialFolderId) {
        setCurrentFolderId(initialFolderId);
        const hierarchy = await buildFolderHierarchy(initialFolderId);
        setFolderHierarchy(hierarchy);
      } else {
        setFolderHierarchy([]);
      }
    };

    initializeFolderHierarchy();
  }, [initialFolderId, buildFolderHierarchy]);

  const handleFolderClick = useCallback(async (folderId: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    try {
      setCurrentFolderId(folderId);
      const newHierarchy = await buildFolderHierarchy(folderId);
      setFolderHierarchy(newHierarchy);
      router.push(`/google/drive/${folderId}`, undefined, { shallow: true });
      await driveFilesQuery.refetch();
    } catch (error) {
      console.error('Failed to navigate to folder:', error);
      toast({
        title: "Error",
        description: "Failed to navigate to the selected folder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsNavigating(false);
    }
  }, [isNavigating, buildFolderHierarchy, router, driveFilesQuery, toast]);

  // const handleBackClick = async () => {
  //   if (isNavigating || folderHierarchy.length <= 1) return;
  //   setIsNavigating(true);
  //   const newHierarchy = folderHierarchy.slice(0, -1);
  //   const parentFolder = newHierarchy[newHierarchy.length - 1];
  //   setCurrentFolderId(parentFolder.id);
  //   setFolderHierarchy(newHierarchy);
  //   router.push(`/google/drive/${parentFolder.id}`);
  //   await driveFilesQuery.refetch();
  //   setIsNavigating(false);
  // };

  const handleTabChange = (value: string) => {
    setCurrentView(value);
    switch (value) {
      case "all":
        setFileType(undefined);
        break;
      case "folders":
        setFileType("mimeType = 'application/vnd.google-apps.folder'");
        break;
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

  const filteredFiles = driveFilesQuery.data?.driveFiles?.filter(file => {
    if (currentView === "all") {
      return true; // Show all files and folders in the "All" tab
    }
    // Other filtering logic remains the same
    return true; // Placeholder, replace with actual filtering logic
  });

  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="flex flex-col items-center space-y-4 mb-4">
        <div className="flex items-center space-x-2 max-w-md w-full">
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow mt-4"
          />
          <Search className="w-4 h-4 text-gray-500 mt-4" />
        </div>
        <Tabs value={currentView} onValueChange={handleTabChange} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
            <TabsTrigger value="pdfs">PDFs</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="spreadsheets">Sheets</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* <div className="flex items-center space-x-2 mb-4">
        <Button variant="ghost" onClick={handleBackClick} disabled={folderHierarchy.length <= 1 || isNavigating}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Breadcrumb className="truncate">
          {folderHierarchy.map((folder, index) => (
            <BreadcrumbItem key={folder.id} isCurrentPage={index === folderHierarchy.length - 1}>
              <BreadcrumbLink
                href="#"
                onClick={() => !isNavigating && handleFolderClick(folder.id)}
              >
                {folder.name}
              </BreadcrumbLink>
              {index < folderHierarchy.length - 1 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </div> */}

      {driveFilesQuery.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : driveFilesQuery.isError ? (
        <div>Error loading files: {driveFilesQuery.error.message}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles && filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <TableRow key={file.id} className="font-medium">
                  <TableCell>
                    {file.mimeType === 'application/vnd.google-apps.folder' ? (
                      <div className="flex items-center cursor-pointer" onClick={() => handleFolderClick(file.id)}>
                        <FolderIcon className="mr-2" />
                        {file.name}
                      </div>
                    ) : (
                      <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-600">
                        <FileIcon className="mr-2" />
                        {file.name}
                      </a>
                    )}
                  </TableCell>
                  <TableCell>{file.owners?.[0]?.displayName || 'Unknown'}</TableCell>
                  <TableCell>{new Date(file.modifiedTime).toLocaleDateString()}</TableCell>
                  <TableCell>{file.parents?.length ? 'My Drive' : 'Root'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center"><b>NO FILES/FOLDER FOUND</b> </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default Drive;