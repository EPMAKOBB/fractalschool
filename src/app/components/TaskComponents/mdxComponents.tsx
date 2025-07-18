import Image from 'next/image';
import SideBySide from './SideBySide';
import TaskTable from './TaskTable';
import { SimpleSVG } from './SimpleSVG';

export const mdxComponents = {
  SideBySide,
  TaskTable,
  SimpleSVG,
  img: (props: any) => <Image {...props} alt={props.alt ?? ''} />,
};
export default mdxComponents;
