import Drive from "../../_components/Drive";

export default function FolderPage({ params }: { params: { folderId: string } }) {
  return (
    <div className="w-full">
      <Drive initialFolderId={params.folderId} />
    </div>
  );
}