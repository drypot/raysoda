/* TODO

using System;
using System.Collections;
using System.ComponentModel;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using Bah;
using Bah.Web;
using Bah.Web.Http;

namespace WebSite.Com.DailyCount
{
  public abstract class View : WebSite.UserControl
  {
    protected Bah.Web.Controls.SqlDataRepeater ItemRep;

    private string key;

    public string Key {
      set {
        key = value;
      }
    }

    private void Page_Load(object sender, System.EventArgs e)
    {
      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        cmd = new SqlCommand("DailyCountSelect", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.Add("@Key", SqlDbType.VarChar, 256).Value = key;
        reader = cmd.ExecuteReader();
        ItemRep.DataSource = reader;
        ItemRep.DataBind();
        reader.Close();
      }
    }

    #region Web Form Designer generated code
    override protected void OnInit(EventArgs e)
    {
      //
      // CODEGEN: This call is required by the ASP.NET Web Form Designer.
      //
      InitializeComponent();
      base.OnInit(e);
    }
    
    ///   Required method for Designer support - do not modify
    ///   the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {
      this.Load += new System.EventHandler(this.Page_Load);

    }
    #endregion
  }
}

*/