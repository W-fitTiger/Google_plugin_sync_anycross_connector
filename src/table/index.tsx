import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef } from 'antd';
import { Button, Form, Input, Popconfirm, Table ,message} from 'antd';
import {  EditableRowProps, DataType, EditableCellProps } from "./types";
import { http } from "../utils/http";
import { useReducer } from 'react';
import { toLog } from '../utils/chrome';
import './index.css'
import boeToOnline from "./boeToOnline";
type FormInstance<T> = GetRef<typeof Form<T>>;
type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
const EditableContext = React.createContext<FormInstance<any> | null>(null);

 type DataReducer = (pre: DataType[], state: Partial<DataType>) => DataType[]



const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};



const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};
const dataReducer: DataReducer = (pre, state)=> {
  return pre.map(item => {
    if (item.type === state.type) {
      return { ...item, ...state }
    }
    return item
  })

}

function App(){

  const [dataSource, dispacthData] = useReducer(dataReducer, [
    {
      key: '0',
      type: 'boe',
      UUID: '',
      connectorId: 'connectorId',
      cookie: false,
    },
    {
      key: '1',
      type: 'online',
      UUID: '',
      connectorId: 'connectorId',
      cookie: false,
    },
  ]);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    testCookie("boe")
    testCookie("online")

  }, [])


  async function testCookie(type: string) {
    const baseUrl = type.startsWith('boe') ? "/boe" : "/online"
    const testId = type.startsWith('boe') ? "7358392639122571284" : "7385490148068294660"
    const res = await http({
      method: "get",
      url: `${baseUrl}/webapi/v3/connector_drafts/${testId}`
    }) as any
    dispacthData({type,cookie:res && res.code === 0})
  }


  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'type',
      dataIndex: 'type',
      width: '30%',
    },
    {
      title: 'UUID',
      dataIndex: 'UUID',
      editable: true,
    },
    {
      title: 'connector ID',
      dataIndex: 'connectorId',
      editable: true,
    },
    {
      title: 'cookie',
      dataIndex: 'cookie',
      render: (bool, record) => {
        if (bool) {
        return <div>cookie未失效</div>
        }else{
          return <Popconfirm title="Sure to delete?" onConfirm={() => getCookie(record.type)}>
          <a>获取cookie</a>
        </Popconfirm>
        }
       
      }
    },
  ];

  function getCookie(type: string) {
    toLog(type)
  }
  const handleSave = (row: DataType) => {
    dispacthData(row)
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className='table'>
      {contextHolder}
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        pagination={false}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
     <Button type="primary" className='btn' onClick={()=>boeToOnline(dataSource,messageApi)}>boe 同步到 online</Button>
    </div>
  );
};
export default App;


