

"use client";

import { useGetDriveFiles } from "@/actions/features/google.feature";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

const Drive = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fileType, setFileType] = useState<string | undefined>();
  const driveFilesQuery = useGetDriveFiles(searchQuery, fileType);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (value: string) => {
    setFileType(value === "docs" ? "application/vnd.google-apps.document" : undefined);
  };

  useEffect(() => {
    driveFilesQuery.refetch();
  }, [searchQuery, fileType]);

  if (driveFilesQuery.isError) {
    return <div>Error: {driveFilesQuery.error.message}</div>;
  }

  return (
    // <div className="h-full w-full grid grid-cols-2 border-r-2">
    <div className="flex-1 flex flex-col w-full">
      <div className="h-full w-full flex flex-col gap-5 border-r-2">
        <Tabs
          defaultValue="all"
          className="h-full"
          onValueChange={handleTabChange}
        >
          <div className="flex justify-between border-t-2 border-b-2 p-5">
            <h1 className="font-semibold text-xl">Google Drive</h1>

            <TabsList className="ml-auto">
              <TabsTrigger
                value="all"
                className="text-zinc-600 dark:text-zinc-200"
              >
                All files
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Documents
              </TabsTrigger>
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

            <TabsContent
              value="all"
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!driveFilesQuery.data?.message &&
                      driveFilesQuery.data?.driveFiles?.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>{file.mimeType}</TableCell>
                          <TableCell>
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Open
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            <TabsContent value="docs" className="m-0">
              {driveFilesQuery.isLoading ? (
                <div>Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>MIME Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!driveFilesQuery.data?.message &&
                      driveFilesQuery.data?.driveFiles?.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>{file.mimeType}</TableCell>
                          <TableCell>
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Open
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Drive;
