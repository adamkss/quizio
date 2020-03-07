import { Grid, GridElement } from '../components/dnd/GridDND';
export default () => {
    return (
        <>
            <main>
                <Grid
                    scrollable
                    gap={20}
                    insidePadding={20}>
                    <GridElement>
                        <div className="element" />
                    </GridElement>
                    <GridElement>
                        <div className="element" />
                    </GridElement>
                    <GridElement>
                        <div className="element" />
                    </GridElement>
                    <GridElement>
                        <div className="element" />
                    </GridElement><GridElement>
                        <div className="element" />
                    </GridElement><GridElement>
                        <div className="element" />
                    </GridElement><GridElement>
                        <div className="element" />
                    </GridElement><GridElement>
                        <div className="element" />
                    </GridElement><GridElement>
                        <div className="element" />
                    </GridElement><GridElement>
                        <div className="element" />
                    </GridElement>

                </Grid>
            </main>
            <style jsx>
                {`
                .element {
                    width: 300px;
                    height: 200px;
                    box-shadow: 3px 3px 10px grey;
                }
            `}
            </style>
        </>
    )
}