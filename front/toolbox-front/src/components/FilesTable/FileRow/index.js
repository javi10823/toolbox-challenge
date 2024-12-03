const FileRow = ({ data }) => {
  const { file, text, number, hex } = data;

  return (
    <tr>
      <td>{file}</td>
      <td>{text}</td>
      <td>{number}</td>
      <td>{hex}</td>
    </tr>
  );
};

export default FileRow;
