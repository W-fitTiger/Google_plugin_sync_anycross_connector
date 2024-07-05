import { MessageInstance } from "antd/es/message/interface"
import { DataType } from "./types"


export default (dataSource: DataType[], messageApi: MessageInstance) => {
    if (!dataSource.every(item => item.cookie)) {
        messageApi.warning("请先获取 Cookie")
    }
    messageApi.error("connector ID无效，请重新输入")
    messageApi.error("UUID不符合，请确认 connector ID")

    messageApi.success("同步成功")
}

