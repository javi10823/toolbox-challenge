import Stack from "react-bootstrap/Stack";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { fileState } from "./store/slices/file";
import { useEffect } from "react";
import { getFiles } from "./store/actions/file";

const App = () => {
  const { files } = useSelector(fileState);
  const dispatch = useDispatch();

  const renderData = () =>
    files.map(({ file, lines }) =>
      lines.map(({ hex, number, text }, index) => (
        <tr key={`${file}-${index}`}>
          <td>{file}</td>
          <td>{text}</td>
          <td>{number}</td>
          <td>{hex}</td>
        </tr>
      ))
    );

  useEffect(() => {
    dispatch(getFiles());
  }, [dispatch]);

  return (
    <Stack gap={3}>
      <h2 className="bg-primary text-white py-2 p-1">React Test App</h2>

      <div className="m-3">
        <Table bordered striped>
          <thead style={{ borderBottom: "2px solid" }}>
            <tr>
              <th>File Name</th>
              <th>Text</th>
              <th>Number</th>
              <th>Hex</th>
            </tr>
          </thead>
          <tbody>{renderData()}</tbody>
        </Table>
      </div>
    </Stack>
  );
};

export default App;
