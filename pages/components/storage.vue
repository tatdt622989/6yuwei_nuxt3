<template>
    <div class="inner-page">
        <div class="main">
            <div class="head">
                <div class="wrap">
                    <div class="left-layout">
                        <nuxt-link to="/components/" class="btn circle">
                            <i class="bi bi-arrow-left"></i>
                        </nuxt-link>
                        <div class="titleBox">
                            <h1>My storage</h1>
                        </div>
                    </div>
                    <ComponentsToolbar />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
useHead({
    title: "Components - storage",
    titleTemplate: "%s - 6yuwei",
    meta: [
        {
            hid: "description",
            name: "description",
            content: "Components - storage",
        },
    ],
});
</script>

<style lang="scss" scoped>
.main {
    padding: 50px 0;
}

.head {
    display: flex;

    .wrap {
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 50px 20px 40px;

        @include media(768) {
            flex-wrap: wrap;
            padding: 30px 20px 20px;
        }

    }

    .left-layout {
        display: flex;
        align-items: center;

        @include media(768) {
            width: 100%;
            margin-bottom: 24px;
            // order: 2;
        }

        >.btn {
            margin-right: 30px;
            flex-shrink: 0;
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
            font-size: 28px;
            @include clamp(2);

            @include media(768) {
                font-size: 24px;
            }

            span {
                color: darken($mainColor, 5%);
            }
        }
    }

    .btn {
        align-self: center;
    }
}
</style>