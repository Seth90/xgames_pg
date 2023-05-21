<template>
    <div class="gamegrid">
        <div class="gamegrid-title">COMING SOON</div>
        <div class="gamegrid-grid">
            <div class="gamegrid-item" v-for="game in ObjList"
                :style="{ 'background-image': `linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 80%, rgba(0, 0, 0, 0.95) 100%),url(${game.boxshot})` }">
                <!-- <img :src="game.boxshot" :alt="game.title" /> -->
                <div class="gamegrid-item-main">
                    <!-- <div class="gamegrid-item__title">{{ game.title }}</div> -->
                    <div class="gamegrid-item__orig">RELEASE DATE:<br /> {{ game.originalReleaseDate }}</div>
                    <!-- <div class="gamegrid-item__preorder">PREORDER DATE: {{ game.preOrderReleaseDate }}</div> -->
                </div>
                <div class="gamegrid-item__button"><button class="">MORE</button></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['csObj'],
    data() {
        return {
            obj: this.csObj
        }
    },
    computed: {
        ObjList() {
            let gameArr = [];
            Object.entries(this.csObj).forEach((entry) => {
                const [key, value] = entry;
                if (typeof (value.originalReleaseDate) !== 'undefined') {
                    gameArr.push({
                        originalReleaseDate: value.originalReleaseDate.split('T')[0],
                        title: value.title,
                        boxshot: value.boxshot
                    })
                }
                // this.csObj.forEach(e => {
                //     e.originalReleaseDate = e.originalReleaseDate.split('T')[0];
                // })
            })
            return gameArr;
        }
    }
}
</script>
<style lang="scss">
.gamegrid {
    margin-top: 45px;
    //padding: 20px;

    &-title {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    &-grid {
        display: flex;
        //grid-template-columns: repeat(5, 1fr);
        flex-wrap: wrap;
        gap: 5px;
        justify-content: space-between;
    }

    &-item {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 5px;
        transition: 0.2s;
        //background-image: url('http://www.pets4homes.co.uk/images/articles/1111/large/feline-influenza-all-about-cat-flu-5239fffd61ddf.jpg');
        content: "";
        background-size: cover;
        background-repeat: no-repeat;
        color: white;
        width: 200px;
        height: 300px;
        //padding: 66.64% 5px 10px 5px;

        /* (img-height / img-width * container-width) */
        /* (853 / 1280 * 100) */
        &:hover {
            border: 5px solid #0094d3;
        }

        &-main {
            display: flex;
            flex-direction: column;
            justify-content: start;
        }

        &__orig {
            font-weight: bold;
            margin-left: 10px;
        }

        &__button {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>