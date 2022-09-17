import uk.ac.warwick.dcs.maze.logic.IRobot;

/**
 * @author zzq
 */
public class DumboController {

    public DumboController() {
    }

    public void controlRobot(IRobot var1) {
        int var2 = (int)Math.round(Math.random() * 3.0);
        short var3;
        if (var2 == 0) {
            var3 = 2003;
        } else if (var2 == 1) {
            var3 = 2001;
        } else if (var2 == 2) {
            var3 = 2002;
        } else {
            var3 = 2000;
        }

        var1.face(var3);
    }
}
