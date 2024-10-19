const FileTreeNode = ({ fileName, nodes, path, onSelect }) => {
    let isDir;
    if (nodes != null) {
        isDir = true;
    }
    else {
        isDir = false;
    }
    return (
        <>
            <span style={{ display: 'flex', cursor: 'pointer' }}
            onClick={(e) => {
                if(isDir) {
                    alert('This is a directory');
                    return;
                }
                e.stopPropagation();
                onSelect(path);
            }}
            >
                <i>{isDir ? '📁' : '📄'}</i> {fileName}
            </span>
            {nodes && (
                <ul>
                    {Object.keys(nodes).map((child, index) => {
                        const isChildDir = nodes[child] !== null; 
                        return (
                            <li  className={isChildDir ? "folder" : "file"} style={{ margin: '10px', listStyle: 'none' }} key={index}>
                                <span style={{display: 'flex'}} >
                                    <FileTreeNode fileName={child} nodes={nodes[child]} path={path + '/' + child} onSelect={onSelect} />
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    )
}
const FileTree = ({ tree, onSelect }) => {
    return (
        <>
            <FileTreeNode fileName={"/"} nodes={tree} path={""} onSelect={onSelect} />
        </>
    )
}
export default FileTree;