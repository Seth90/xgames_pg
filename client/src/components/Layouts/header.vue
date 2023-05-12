<template>
    <div class="header">
        <div class="header-logo"><img src="/imgs/eaaccess.png" alt=""></div>
        <div class="header-menu">
            <nav>
                <div class="header-navigation">
                    <div class="header-navigation__item"><a href="/">Main</a></div>
                    <div class="header-navigation__item"><a href="/allDeals">All Deals</a></div>
                    <div class="header-navigation__item"><a href="/weekDeals">Deals of the week</a></div>
                    <div class="header-navigation__item"><a href="/ComingSoon">Coming Soon</a></div>
                </div>
            </nav>
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    background: #0094d3;
    text-align: center;
    color: #fff;
    &-logo {
        margin-left: 20px;
        img {
            display: block;
        }
    }

    &-navigation {
        display: flex;
        justify-content: right;
        align-items: center;
        gap: 10px;
        margin-right: 20px;


        &__item {
            a {
                display: block;
                color: white;
                text-transform: uppercase;
                font-weight: bold;
            }

            &:not(:last-child) {
                border-right: 1px solid #fff;
                padding-right: 10px;
            }
        }

        a {
            text-decoration: none;

            &:link {
                color: white;
            }

            &:visited {
                color: white;
            }

            &:hover {
                color: greenyellow;
                cursor: pointer;
            }
        }
    }
}
</style>