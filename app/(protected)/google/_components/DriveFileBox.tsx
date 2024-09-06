import React from "react";
import { DriveFile } from "@/types/index.types"; // Ensure DriveFile type is defined properly

interface DriveFileBoxProps {
    file: DriveFile;
}

// const DriveFileBox: React.FC<DriveFileBoxProps> = ({ file }) => {
//     return (
//         <div className="p-4 border-b">
//             <div className="font-medium">{file.name}</div>
//             <div className="text-sm text-muted-foreground">{file.mimeType}</div>
//         </div>
//     );
// };

// export default DriveFileBox;
const DriveFileBox: React.FC<DriveFileBoxProps> = ({ file }) => {
    return (
        <div className="p-4 border-b">
            <div className="font-medium">
                <a 
                    href={file.webViewLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline cursor-pointer"
                >
                    {file.name}
                </a>
            </div>
            <div className="text-sm text-muted-foreground">{file.mimeType}</div>
        </div>
    );
};

export default DriveFileBox;