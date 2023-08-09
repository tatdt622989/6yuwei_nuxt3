<template>
    <div class="card-wrap">
        <div class="card">
            <div class="head">
                <div class="category">
                    <span>Button</span>
                    <img src="@/assets/images/arrow.png" alt="arrow">
                </div>
            </div>
            <div class="content"></div>
            <div class="info">
                <div class="text">
                    <h2>Gradient Button</h2>
                    <p class="by">create by <span class="author">6yuwei</span></p>
                </div>
                <button class="copy">
                    <span class="material-symbols-outlined">
                        file_copy
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.card {
    background-color: $secColor;
    border-radius: 10px;
    background: #3F3F3F;
    box-shadow: 0px 0px 25px 0px rgba(40, 203, 146, 0.40);
    padding: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;

    .head {
        .category {
            display: flex;
            border-radius: 5px 0 0 5px;
            overflow: hidden;
            margin-bottom: 18px;

            span {
                background-color: $mainColor;
                color: #fff;
                font-size: 22px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                letter-spacing: 0.77px;
                padding-left: 13px;
                padding-right: 2px;
                @include clamp;
            }

            img {
                height: 36px;
            }
        }
    }

    .content {
        height: 270px;
        border-radius: 10px;
        border: 2px solid #737373;
    }

    .info {
        display: flex;
        justify-content: space-between;
        padding-top: 12px;

        .text {
            h2 {
                color: $mainColor;
                font-size: 26px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                letter-spacing: 0.91px;
                @include clamp;
            }
            
            .by {
                color: #FFF;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: 0.56px;
                @include clamp;
            }

        }
        .copy {
            width: 52px;
            height: 52px;
            border-radius: 10px;
            background: linear-gradient(135deg, #8370FF 0%, #FF007A 100%);
            border: 0;
            @include center;
            margin-top: 8px;
            span {
                color: #fff;
                font-size: 30px;
            }
        }
    }
}
</style>