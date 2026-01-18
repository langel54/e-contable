// third-party
import { merge } from 'lodash';

// project import
import Badge from './Badge';
import Button from './Button';
import Card from './Card';
import CardContent from './CardContent';
import Checkbox from './Checkbox';
import Chip from './Chip';
import DataGrid from './DataGrid';
import Dialog from './Dialog';
import IconButton from './IconButton';
import InputLabel from './InputLabel';
import LinearProgress from './LinearProgress';
import Link from './Link';
import ListItemIcon from './ListItemIcon';
import OutlinedInput from './OutlinedInput';
import Paper from './Paper';
import Tab from './Tab';
import Table from './Table';
import TableCell from './TableCell';
import Tabs from './Tabs';
import Tooltip from './Tooltip';
import Typography from './Typography';

// ==============================|| OVERRIDES - MAIN ||============================== //

export default function ComponentsOverrides(theme) {
  return merge(
    Button(theme),
    Badge(theme),
    Card(theme),
    CardContent(),
    Checkbox(theme),
    Chip(theme),
    DataGrid(theme),
    Dialog(theme),
    IconButton(theme),
    InputLabel(theme),
    LinearProgress(),
    Link(),
    ListItemIcon(),
    OutlinedInput(theme),
    Paper(theme),
    Tab(theme),
    Table(theme),
    TableCell(theme),
    Tabs(),
    Tooltip(theme),
    Typography()
  );
}
