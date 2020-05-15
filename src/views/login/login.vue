<template>
    <div class="login">
        <div class="login-form">
            <h2>用户登录</h2>
            <div>
                <el-form ref="forms" :model="formData" :rules="rules">
                    <el-form-item prop="name">
                        <el-input v-model="formData.name" placeholder="用户名/邮箱/手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="formData.password" placeholder="请输入密码" type="password"></el-input>
                    </el-form-item>
                    <el-form-item align="center" class="login-btn">
                        <span @click="submitFormData('forms')">登 录</span>
                        <div class="loadEffect" v-if="loading">
                            <div>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </el-form-item>
                    <!-- <el-form-item class="login-register">
                        <el-checkbox label="记住密码" v-model="rememberPassword"></el-checkbox>
                        <el-checkbox label="自动登陆" v-model="autoLogin"></el-checkbox>
                        <span>免费注册</span>
                        <span>忘记密码</span>
                    </el-form-item>-->
                </el-form>
            </div>
        </div>
        <!-- 系统列表 -->
        <div class="login-shadow" v-if="showBox">
            <div class="role-warp">
                <div class="role-tit">选择您要进入的系统</div>
                <ul class="role-lists">
                    <li v-for="item in sysList" :key="item.id">
                        <a
                            :href="(Cookies.get('login_invite')&&item.systemCode=='datavp')?Cookies.get('login_invite'):'/'+item.systemCode"
                        >{{item.systemName}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import api from "@/api/index.js";
    import Cookies from "js-cookie";
    import { JSEncrypt } from "jsencrypt";
    export default {
        data() {
            return {
                formData: {
                    name: "",
                    password: "",
                    check: ""
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: "请输入用户名/邮箱/手机号",
                            trigger: "blur"
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: "请输入密码",
                            trigger: "blur"
                        }
                    ]
                },
                rememberPassword: false,
                autoLogin: false,
                showBox: false,
                loading: false,
                sysList: []
            };
        },
        created() {},
        mounted() {},
        methods: {
            submitFormData(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.$http.get(api.getPublicKey).then(res => {
                            console.log("getPublicKey", res);
                            if (res.code == 0) {
                                let publicKey = res.public_key;
                                //加密操作
                                let encrypt = new JSEncrypt();
                                encrypt.setPublicKey(publicKey); //设置公钥
                                let encrypted = encrypt.encrypt(
                                    this.formData.password
                                );
                                // let encrypted = encrypt.encrypt(
                                //     md5(this.formData.password)
                                // );
                                let params = {
                                    username: this.formData.name,
                                    password: encrypted,
                                    kaptcha: ""
                                };
                                this.$http.post(api.toLogin, params).then(res => {
                                    console.log("restologin", res);
                                    if (res.code == 0) {
                                        this.$http
                                            .post(api.getIndexData)
                                            .then(res => {
                                                this.loading = false;
                                                //    this.$http.get(api.loginOut).then(res => {})
                                                if (res.code == 0) {
                                                    // window.localStorage.setItem(
                                                    //     "userinfo",
                                                    //     JSON.stringify(res)
                                                    // );
                                                    console.log(
                                                        "getIndexData",
                                                        res
                                                    );
                                                    Cookies.set(
                                                        "userId",
                                                        res.userId,
                                                        { expires: 7 }
                                                    );
                                                    Cookies.set(
                                                        "userName",
                                                        res.userName,
                                                        { expires: 7 }
                                                    );
                                                    Cookies.set(
                                                        "organId",
                                                        res.identify.organId,
                                                        { expires: 7 }
                                                    );
                                                    // Cookies.set(
                                                    //     "login_invite",
                                                    //     "login_invite",
                                                    //     { expires: 7 }
                                                    // );
                                                    if (
                                                        res.sysList.length &&
                                                        res.sysList.length == 1
                                                    ) {
                                                        if (
                                                            Cookies.get(
                                                                "login_invite"
                                                            )
                                                        ) {
                                                            let url = Cookies.get(
                                                                "login_invite"
                                                            );
                                                            window.location.href = url;
                                                        } else {
                                                            if (
                                                                process.env
                                                                    .NODE_ENV ==
                                                                "development"
                                                            ) {
                                                                window.location.href =
                                                                    "http://localhost:8081/" +
                                                                    res.sysList[0]
                                                                        .systemCode;
                                                            } else {
                                                                window.location.href =
                                                                    "/" +
                                                                    res.sysList[0]
                                                                        .systemCode;
                                                            }
                                                        }
                                                    } else {
                                                        this.sysList = res.sysList;
                                                        this.showBox = true;
                                                    }
                                                } else {
                                                    this.$message({
                                                        message: "获取系统信息失败",
                                                        center: true
                                                    });
                                                }
                                            });
                                    } else {
                                        this.loading = false;
                                        this.$message({
                                            message: res.msg,
                                            center: true
                                        });
                                    }
                                });
                            } else {
                                this.loading = false;
                                this.$message({
                                    message: res.statusText,
                                    center: true
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>

<style lang="scss">
    @import "./login.scss";
</style>