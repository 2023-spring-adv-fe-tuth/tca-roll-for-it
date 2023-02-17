export const Home = () => {
    return (
        <div
            className="flex flex-col"
        >
            <h2
                className="text-3xl text-left font-bold"
            >
                Home
            </h2>
            <br />
            <button 
                className="btn btn-lg btn-primary capitalize"
            >
                Play Roll for It
            </button>
            <br />
            <div
                className="flex"
            >
                <div className="card w-96 bg-base-100 shadow-xl bg-base-200 grow">
                    <div className="card-body">
                        <h2 className="card-title">Leaderboard</h2>
                    
                        {/* <table className="table table-zebra w-full">
                            <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Job</th>
                                <th>Favorite Color</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>1</th>
                                <td>Cy Ganderton</td>
                                <td>Quality Control Specialist</td>
                                <td>Blue</td>
                            </tr>
                            <tr>
                                <th>2</th>
                                <td>Hart Hagerty</td>
                                <td>Desktop Support Technician</td>
                                <td>Purple</td>
                            </tr>
                            <tr>
                                <th>3</th>
                                <td>Brice Swyre</td>
                                <td>Tax Accountant</td>
                                <td>Red</td>
                            </tr>
                            </tbody>
                        </table> */}
                        

                    </div>
                </div>
            </div>
            <br />
            <div
                className="flex"
            >
                <div className="card w-96 bg-base-100 shadow-xl grow">
                    <div className="card-body">
                        <h2 className="card-title">Average Game Times</h2>
                    </div>
                </div>
            </div>
            <br />
            <div
                className="flex"
            >
                <div className="card w-96 bg-base-100 shadow-xl bg-base-200 grow">
                    <div className="card-body">
                        <h2 className="card-title">Winning Sequences</h2>
                    </div>
                </div>
            </div>
      </div>
    );
};