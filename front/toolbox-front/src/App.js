import Stack from "react-bootstrap/Stack";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getFileList, getFiles } from "./store/actions/file";
import { FilesTable, SearchInput } from "./components";
import { fileState } from "./store/slices/file";

const App = () => {
  const { fileList } = useSelector(fileState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFiles());
    dispatch(getFileList());
  }, [dispatch]);

  const onSearch = (value) => {
    dispatch(getFiles(value));
  };

  return (
    <Stack gap={3}>
      <h2 className="bg-primary text-white py-2 p-1">React Test App</h2>

      <Stack gap={3} className="m-3">
        <SearchInput onSearch={onSearch} suggestions={fileList} />

        <FilesTable />
      </Stack>
    </Stack>
  );
};

export default App;
