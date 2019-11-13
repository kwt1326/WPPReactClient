import React, { useEffect } from 'react';
import ThreeComp from '../components/three/threeCreator';
import Introduce2D from '../components/introduce';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { connect } from 'react-redux';
import { changeviewstate } from '../reducer/toggle';
import '../css/style.css';

const btn_ex_style = {
    width : "50px",
    height : "50px",
}

function ToggleButton(changeviewstate) {
    return (
        <Grid item style={{ padding : '24px', backgroundColor : 'whitesmoke', textAlign : 'center'}}>
            <ButtonGroup
              variant="contained"
              color="secondary"
              size="large"
              aria-label="button group"
              style={{ float: 'left' }}
            >
              <Button onClick={() => {changeviewstate('2D');}}>2D</Button>
              {/* <Button onClick={() => {changeviewstate('3D');}}>3D</Button> */}
            </ButtonGroup>
              <Button size="large" style={{ fontWeight : 'bold' }}>Profile</Button>
            <ButtonGroup style={{ float: 'right' }}>
              <Button size="large" style={{ fontWeight : 'bold' }}>Introduce</Button>
            </ButtonGroup>
        </Grid>
    )
}

const Introduce = ({ viewstate, changeviewstate }) => {

    useEffect(() => {
        return () => {
        };
      }, [viewstate]);

    if(viewstate === '3D')
        return (
            <React.Fragment>
                {ToggleButton(changeviewstate)}
                <ThreeComp />
            </React.Fragment>
        );
    else
        return (
            <React.Fragment>
                {ToggleButton(changeviewstate)}
                <Introduce2D />
            </React.Fragment>
        );
}

const mapStateToProps = state => ({
    viewstate: state.toggle.intro_viewstate,
});

const mapDispatchToProps = dispatch => ({
    changeviewstate: viewstate => dispatch(changeviewstate(viewstate)),
});  

export default connect(mapStateToProps, mapDispatchToProps)(Introduce);