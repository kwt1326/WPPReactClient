import React from 'react';
import { connect } from 'react-redux';
import { CssBaseline, Typography, Container, Grid, Paper, GridList, GridListTile } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: 'white', 
      height: '100vh',
      padding : '20px'
    },
    padding: {
        padding : '20px'
    },
    padding_small: {
        padding : '10px'
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
}));

const style = {
    img: { width : 'auto', height : 'auto', },
    list: { listStyle : 'none' }
}

const skills ={
    company_skills : [
        'C++ + STL',
        'C#',
        'Javascript',
        'JQuery',
        'Three.js',
        'Ogre3D',
        'Extreme toolkit',
        'InnoSetup',
        'Windows MFC',
    ],
    all_skills : [
        'Javascript',
        'React',
        'React-Redux',
        'Express',
        'Sequelize',
        'Three.js',
        'MaterialUI',
        'MySql',
        'C++ + STL',
        'C#',
        'Windows MFC',
        'Unity3D',
        'Heroku, Netlify CloudService'
    ],
    seoul_skills : [
        'JQuery', 'Three.js', 'CSS + HTML', 'gulp'
    ],
    blog_skills : [
        'React',
        'React-Redux',
        'MaterialUI',
        'Express',
        'multer',
        'passport',
        'MySql',
        'jwt',
        'bcrypt',
        'cloudinary',
    ],
}

function Introduce2D ({ screenstate }) {
    const classes = useStyles();
    return(
        <React.Fragment>
            <CssBaseline />
            <section style={{ backgroundColor : "white", overflow: "auto" }}>
                <Container maxWidth='xl'>
                    <Typography component="div" className={classes.root}>
                        <Grid container 
                            direction="column"
                            justify="center"
                            alignItems="center"
                            spacing={5}
                            className={classes.padding}
                            >
                            <Grid container
                                className={classes.padding}
                                >
                                <ul>
                                    <h2>김원태</h2>
                                    <h3>JavaScript Full-Stack 개발자</h3>
                                    <li style={style.list}>Front-end - React</li>
                                    <li style={style.list}>Back-end - Node.js (Framework - Express)</li>
                                    <h3><a href="https://github.com/kwt1326">GitHub</a></h3>
                                    <h3><a href="/contact">Contact</a></h3>
                                </ul>
                            </Grid>
                            <Grid container 
                                className={classes.padding}
                                >
                                <ul>
                                    <h2>경력</h2>
                                    <li>2017.12 ~ 2019.7 ( 1년 7개월 ) / Avrosoft Korea</li><br/>
                                    <li style={style.list}>
                                        <Grid container
                                            direction="row"
                                            spacing={5}
                                            className={classes.padding_small}
                                        >
                                        {skills.company_skills.map(elem => (
                                            <Paper elevation={5} className={classes.padding_small}>{elem}</Paper>    
                                        ))}
                                        </Grid>
                                    </li>
                                </ul>
                            </Grid>
                            <Grid container 
                                className={classes.padding}
                                >
                                <ul>
                                    <h2>학력</h2>
                                    <li>2011.3 ~ 2018.2 / 가톨릭 관동대학교 컴퓨터공학과 학사</li><br/>
                                </ul>
                            </Grid>
                            <Grid container 
                                className={classes.padding}
                                >
                                <ul>
                                    <h2>가능한 기술</h2>
                                    <li style={style.list}>
                                        <Grid container
                                            direction="row"
                                            spacing={5}
                                            className={classes.padding_small}
                                        >
                                        {skills.all_skills.map(elem => (
                                            <Paper elevation={5} className={classes.padding_small}>{elem}</Paper>    
                                        ))}
                                        </Grid>
                                    </li>
                                </ul>
                            </Grid>
                            <Grid container 
                                direction="column"
                                className={classes.padding}
                                spacing={5}
                                >
                                <ul>
                                <h2>프로젝트</h2>
                                <Paper>
                                    <GridList cellHeight={'auto'} className={classes.gridList} cols={(screenstate === 'desktop') ? 3 : 1}>
                                        <GridListTile cols={1}>
                                            <img style={style.img} src="https://res-console.cloudinary.com/hwsub5r14/thumbnails/v1/image/upload/v1573619954/c2VvdWwxX2NqN3Fncg/" alt='seoul1'></img>
                                        </GridListTile>
                                        <GridListTile cols={1}>
                                            <img style={style.img} src="https://res-console.cloudinary.com/hwsub5r14/thumbnails/v1/image/upload/v1573619955/c2VvdWwzX2JiYmJrcA/" alt='seoul2'></img>
                                        </GridListTile>
                                        <GridListTile cols={1}>
                                            <img style={style.img} src="https://res-console.cloudinary.com/hwsub5r14/thumbnails/v1/image/upload/v1573619955/c2VvdWwyX2c5dmx2eQ/" alt='seoul3'></img>
                                        </GridListTile>
                                        </GridList>
                                        <ul>
                                        <h3>서울기록관 관제시스템 프로젝트</h3>
                                        <Grid container
                                            direction="row"
                                            spacing={5}
                                            className={classes.padding_small}
                                        >
                                            {skills.seoul_skills.map(elem => (
                                                <Paper elevation={5} className={classes.padding_small}>{elem}</Paper>    
                                            ))}
                                        </Grid>
                                        <br/>
                                        <li>사내 업무 프로젝트</li>
                                        <li>
                                            Three.js 로 렌더링된 모델을 층별로 분리하여 확인할 수 있고, 
                                            각 층 별로 POI 를 설치해 각 지점의 현재 상황 정보를 담아 볼 수 있어 위급 상황 시
                                            서버에서 알림을 보내어 경보를 울릴 수 있는 시스템 입니다.
                                        </li>
                                        <br/>
                                        </ul>
                                </Paper>
                                <br/>
                                <Paper>
                                    <GridList cellHeight={'auto'} className={classes.gridList} cols={(screenstate === 'desktop') ? 4 : 1}>
                                        <GridListTile cols={1}>
                                            <img style={style.img} src="https://res.cloudinary.com/hwsub5r14/image/upload/v1573624118/blog1_unazzn.png" alt='blog1'></img>
                                        </GridListTile>
                                        <GridListTile cols={1}>
                                            <img style={style.img} src="https://res.cloudinary.com/hwsub5r14/image/upload/v1573624118/blog2_ixdpso.png" alt='blog2'></img>
                                        </GridListTile>
                                        <GridListTile cols={1}>
                                            <img style={style.img} src="https://res.cloudinary.com/hwsub5r14/image/upload/v1573624119/blog3_m9tike.png" alt='blog3'></img>
                                        </GridListTile>
                                        <GridListTile cols={1}>
                                            <img style={style.img} src="https://res.cloudinary.com/hwsub5r14/image/upload/v1573624120/blog4_im3n0g.png" alt='blog4'></img>
                                        </GridListTile>
                                    </GridList>
                                    <ul>
                                    <h3>개인 블로그 프로젝트</h3>
                                    <Grid container
                                        direction="row"
                                        spacing={5}
                                        className={classes.padding_small}
                                    >
                                        {skills.blog_skills.map(elem => (
                                            <Paper elevation={5} className={classes.padding_small}>{elem}</Paper>    
                                        ))}
                                    </Grid>
                                    <br/>
                                    <li>개인 웹 개발 프로젝트</li>
                                    <li>
                                        로그인 (로컬, 페이스북, 구글)
                                        <li style={style.list}>Passport + jwt 인증</li>
                                    </li>
                                    <li>
                                        이미지 전송 및 관리
                                        <li style={style.list}>multer + cloudinary(cloud service)</li>
                                    </li>
                                    <li>
                                        글쓰기 ( 포스트, 댓글 )
                                        <li style={style.list}>Quill wisiwig editor</li>
                                    </li>
                                    <li>
                                        반응형 웹 형식 구현
                                    </li>
                                    <br/>
                                    </ul>
                                </Paper>
                                </ul>
                            </Grid>
                        </Grid>
                    </Typography>
                </Container>
            </section>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    screenstate: state.screen.screenstate,
});

export default connect(mapStateToProps)(Introduce2D);