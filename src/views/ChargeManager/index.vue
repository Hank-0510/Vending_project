<template>
    <el-card>
        <div>
            <el-table style="width: 100%;" :data="data" border height="1000px">
                <el-table-column type="selection" width="80">
                </el-table-column>
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="userName" label="商户号" width="150">
                </el-table-column>
                <el-table-column prop="passWord" label="机器编号" width="150">
                </el-table-column>
                <el-table-column prop="weixin" label="机器截止使用时间" width="150">
                </el-table-column>
                <el-table-column prop="merchantId" label="机器余额" width="150">
                </el-table-column>
                <el-table-column prop="note" label="备注" width="width">
                </el-table-column>
                <el-table-column prop="prop" label="操作" width="200">
                    <template v-slot="{ row, $index }">
                        <el-button type="primary" @click="changeShow">
                            <el-icon style="margin-right: 5px;">
                                <Plus />
                            </el-icon>
                            充值
                        </el-button>
                        <el-popconfirm :title="`你确定要删除${row.userName}`">
                            <template #reference>
                                <el-button type="danger">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog v-model="show" title="充值页面" width="500" center>
            <el-input  placeholder="输入充值金额" style="margin-bottom: 10px;"></el-input>
            <div style="text-align: center;">
                <img style="width: 250px; height: 250px;" src="https://api.rls.ovh/horizontal" alt="">
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="changeShow">取消</el-button>
                    <el-button type="primary" @click="changeShow">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </el-card>
</template>

<script lang="ts" setup name="UserManager">
import { ref, reactive } from 'vue';
let show = ref(false)
const changeShow = function () {
    show.value = !show.value
}

interface People {
    name: string;
    id: number;
}
let people = reactive<People[]>([{ name: '管理员', id: 1 }, { name: '游客', id: 2 }])
let selection = ref("")

interface TableData {
    userName: string;
    passWord: string;
    weixin: string;
    merchantId: string;
    accountType: string;
    onlineStatus: string;
    note: string;
}
const data = reactive<TableData[]>([
    {
        userName: "user1",
        passWord: "password1",
        weixin: "wx123456",
        merchantId: "100001",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user2",
        passWord: "password2",
        weixin: "wx654321",
        merchantId: "100002",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user3",
        passWord: "password3",
        weixin: "wx789012",
        merchantId: "100003",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user4",
        passWord: "password4",
        weixin: "wx345678",
        merchantId: "100004",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user5",
        passWord: "password5",
        weixin: "wx901234",
        merchantId: "100005",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user6",
        passWord: "password6",
        weixin: "wx567890",
        merchantId: "100006",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user7",
        passWord: "password7",
        weixin: "wx135790",
        merchantId: "100007",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user8",
        passWord: "password8",
        weixin: "wx246801",
        merchantId: "100008",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user9",
        passWord: "password9",
        weixin: "wx357913",
        merchantId: "100009",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user10",
        passWord: "password10",
        weixin: "wx468024",
        merchantId: "100010",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user11",
        passWord: "password11",
        weixin: "wx579135",
        merchantId: "100011",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user12",
        passWord: "password12",
        weixin: "wx680246",
        merchantId: "100012",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user13",
        passWord: "password13",
        weixin: "wx791357",
        merchantId: "100013",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user14",
        passWord: "password14",
        weixin: "wx802468",
        merchantId: "100014",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user15",
        passWord: "password15",
        weixin: "wx913579",
        merchantId: "100015",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user16",
        passWord: "password16",
        weixin: "wx024680",
        merchantId: "100016",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user17",
        passWord: "password17",
        weixin: "wx135791",
        merchantId: "100017",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user18",
        passWord: "password18",
        weixin: "wx246802",
        merchantId: "100018",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user19",
        passWord: "password19",
        weixin: "wx357913",
        merchantId: "100019",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user20",
        passWord: "password20",
        weixin: "wx468024",
        merchantId: "100020",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user21",
        passWord: "password21",
        weixin: "wx579135",
        merchantId: "100021",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user22",
        passWord: "password22",
        weixin: "wx680246",
        merchantId: "100022",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user23",
        passWord: "password23",
        weixin: "wx791357",
        merchantId: "100023",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user24",
        passWord: "password24",
        weixin: "wx802468",
        merchantId: "100024",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user25",
        passWord: "password25",
        weixin: "wx913579",
        merchantId: "100025",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user26",
        passWord: "password26",
        weixin: "wx024680",
        merchantId: "100026",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
    {
        userName: "user27",
        passWord: "password27",
        weixin: "wx135791",
        merchantId: "100027",
        accountType: "管理员",
        onlineStatus: "在线",
        note: "无",
    },
    {
        userName: "user28",
        passWord: "password28",
        weixin: "wx246802",
        merchantId: "100028",
        accountType: "普通用户",
        onlineStatus: "离线",
        note: "无",
    },
]);

</script>

<style>
.inputClass {
    width: 500px;
}
</style>