<template>
    <div class="inner-page">
        <div class="head">
            <div class="wrap">
                <nuxt-link to="/components/" class="btn circle">
                    <i class="bi bi-arrow-left"></i>
                </nuxt-link>
                <div class="titleBox">
                    <p class="category">Button</p>
                    <h1>Gradient Button</h1>
                </div>
                <div class="toolBox">
                    <button class="storage btn circle">
                        <i class="bi bi-inboxes-fill"></i>
                    </button>
                    <button class="copy btn circle">
                        <i class="bi bi-arrow-left-right"></i>
                    </button>
                    <div class="balance">
                        <p>999</p>
                        <img src="@/assets/images/currency.svg" alt="currency">
                    </div>
                </div>
            </div>
        </div>
        <div class="wrap">
            <div class="generatorBox">
                <input type="text" placeholder="Search for components created by everyone" />
                <button class="generatorBtn">Generate</button>
            </div>
            <div class="content">
                <div class="editor">
                    <div class="preview"></div>
                    <div class="style"></div>
                    <div class="bottom">
                        <div class="script"></div>
                        <div class="html"></div>
                    </div>
                </div>
                <div class="storage"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_setting.scss';

.inner-page {
    .wrap {
        max-width: 1480px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    .head {
        display: flex;

        .wrap {
            display: flex;
            align-items: center;
            flex-direction: row;
            padding: 50px 20px 40px;

            >.btn {
                margin-right: 30px;
            }
        }

        .titleBox {
            .category {
                color: $mainColor;
                font-size: 20px;
                font-style: normal;
                font-weight: 700;
                line-height: 1.3;
            }

            h1 {
                margin: 0;
            }
        }

        .toolBox {
            flex-grow: 1;
            display: flex;
            justify-content: flex-end;

            .btn {
                margin-left: 20px;
                cursor: pointer;
            }

            .balance {
                background-color: $secColor;
                border-radius: 10px;
                display: flex;
                padding: 10px 16px;
                min-width: 140px;
                box-sizing: border-box;
                justify-content: space-between;
                margin-left: 20px;

                p {
                    color: #FFF;
                    font-size: 22px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                    letter-spacing: 0.77px;
                }
            }
        }

        .btn {
            align-self: center;
        }
    }

    .generatorBox {
        display: flex;
        overflow: hidden;
        border-radius: 10px;
        background: #FFF;
        box-shadow: 0px 0px 30px 0px rgba(40, 203, 146, 0.20);
        width: 100%;
        margin-bottom: 40px;

        input {
            width: 100%;
            height: 52px;
            border: 0;
            padding: 0 20px;
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            letter-spacing: 0.7px;
            color: $mainColor;

            &:focus {
                outline: none;
            }

            &::placeholder {
                color: #A6E1CB;
            }
        }

        .generatorBtn {
            background: linear-gradient(90deg, $fiveColor 0%, $sixColor 100%);
            background-size: 100% auto;
            height: 52px;
            border-radius: 10px;
            border: 0;
            color: #FFF;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            letter-spacing: 0.7px;
            padding: 10px;
            min-width: 140px;
            @extend %ts;
            cursor: pointer;
            &:hover {
                background-size: 120% auto;
            }
        }
    }
}
</style>