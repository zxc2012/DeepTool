import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Admin from '../pages/admin';
import Login from '../pages/login';
import Register from '../pages/register';
import Dashboard from '../pages/dashboard';
import CTManager from '../pages/ct-manager';
import CT1Manager from '../pages/ct1-manager';
import CTAnalysis from '../pages/ct-analysis';
import PatientManager from '../pages/patient-manager';
import DoctorManager from '../pages/doctor-manager';
import ADoctorManager from '../pages/auditDoctor-manager';
import Report from '../pages/report';
import PersonalCenter from '../pages/personal-center';
import UserManager from '../pages/user-manager';
import LogManager from '../pages/log-manager';
import ModelManager from '../pages/model-manager';
import ReplayManager from '../pages/replay-manager';

export default class ERouter extends React.Component {

    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/app" render={() =>
                        <Admin>
                            <Switch>
                                <Route path='/app/dashboard' component={Dashboard} />
                                <Route path='/app/ct-manager' component={CTManager} />
                                <Route path='/app/ct1-manager' component={CT1Manager} />
                                <Route path='/app/ct-analysis' component={CTAnalysis} />
                                <Route path='/app/patient-manager' component={PatientManager} />
                                <Route path='/app/doctor-manager' component={DoctorManager} />
                                <Route path='/app/auditDoctor-manager' component={ADoctorManager} />
                                <Route path='/app/report' component={Report} />
                                <Route path='/app/personal-center' component={PersonalCenter} />
                                <Route path='/app/user-manager' component={UserManager} />
                                <Route path='/app/log-manager' component={LogManager} />
                                <Route path='/app/model-manager' component={ModelManager} />
                                <Route path='/app/replay-manager' component={ReplayManager} />
                                <Route render={() => <Redirect to="/app/dashboard" />} />
                            </Switch>
                        </Admin>
                    } />
                    <Route render={() => <Redirect to="/app/dashboard" />} />
                </Switch>
            </HashRouter>
        );
    }
}