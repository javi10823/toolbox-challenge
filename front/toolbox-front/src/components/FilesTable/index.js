import Table from "react-bootstrap/Table";
import { useSelector } from "react-redux";
import { fileState } from "../../store/slices/file";
import FileRow from "./FileRow";
import Spinner from "react-bootstrap/Spinner";

const FilesTable = () => {
  const { files, isLoadingFiles } = useSelector(fileState);

  const renderLineOfFile = ({ file, lines }) =>
    lines.map((line, index) => (
      <FileRow key={`${file}-${index}`} data={{ file, ...line }} />
    ));

  const renderData = () => files.map(renderLineOfFile);

  if (isLoadingFiles)
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  return (
    <Table striped className="border border-ligh">
      <thead className="border-bottom border-dark">
        <tr>
          <th>File Name</th>
          <th>Text</th>
          <th>Number</th>
          <th>Hex</th>
        </tr>
      </thead>
      <tbody>{renderData()}</tbody>
    </Table>
  );
};

export default FilesTable;
