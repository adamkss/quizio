import {Grid, GridElement} from '../components/dnd/GridDND';
export default () => {
    return (
        <>
            <main>
                <Grid
                    scrollable
                    gap={20}
                    insidePadding={20}>
                    <GridElement id={0} />
                    <GridElement id={1} />
                    <GridElement id={2} />
                    <GridElement id={3} />
                    <GridElement id={4} />
                    <GridElement id={5} />
                    <GridElement id={6} />
                    <GridElement id={7} />
                    <GridElement id={8} />
                </Grid>
            </main>
            <style jsx>
                {`
            `}
            </style>
        </>
    )
}