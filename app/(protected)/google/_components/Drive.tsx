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
      return true; 
    }
   
    return true; 
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