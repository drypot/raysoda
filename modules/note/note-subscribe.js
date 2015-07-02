/* TODO


using System;
using System.Text;
using System.Collections;
using System.ComponentModel;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.IO;
using Bah;
using Bah.Web;
using Bah.Web.Http;
using Bah.Web.Controls;
using Bah.Web.Html;

namespace WebSite.Com.Note
{
  public class TSubscribe : WebSite.Com.Note.Page
  {
    private void Page_Load(object sender, System.EventArgs e) {
      AssertAuthenticated();
      SetNoteContext();
      NoteContext nc = NoteContext;

      Assert(nc.ThreadID > 0);

      SqlConnection conn;
      SqlCommand cmd;

      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        nc.ReadFolder(conn);

        if (Request.QueryString["cmd"] == "y") {
          cmd = new SqlCommand("BBSSubscribe", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
          cmd.Parameters.Add("@ThreadID", SqlDbType.Int).Value = nc.ThreadID;
          cmd.ExecuteNonQuery();
        } else {
          cmd = new SqlCommand("BBSUnsubscribe", conn);
          cmd.CommandType = CommandType.StoredProcedure;
          cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = UserID;
          cmd.Parameters.Add("@ThreadID", SqlDbType.Int).Value = nc.ThreadID;
          cmd.ExecuteNonQuery();
        }
      }

      ReturnToHostPage();
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
    
    /// <summary>
    /// Required method for Designer support - do not modify
    /// the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {    
      this.Load += new System.EventHandler(this.Page_Load);
    }
    #endregion
  }
}



*/
