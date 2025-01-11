import { useResizable } from 'react-resizable-layout';

const Component = () => {
  const { position, separatorProps } = useResizable({
    axis: 'x',
  })

  return (
    <div className="wrapper">
      <div className="left-block" style={{ width: position }} />
      <YourSeparatorComponent {...separatorProps} />
      <div className="right-block" />
    </div>
  )
}

export default Component;