export interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

export interface EditableRowProps {
  index: number;
}

export interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

export interface DataType {
  key: React.Key;
  type: string;
  connectorId: string;
  UUID:string
  cookie: boolean;
}