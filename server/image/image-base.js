var exec = require('child_process').exec;

var init = require('../base/init');
var error = require('../base/error');
var fsp = require('../base/fs');
var config = require('../base/config');
var mongop = require('../mongo/mongo');
var imageb = exports;

error.define('IMAGE_NOT_EXIST', '파일이 없습니다.');
error.define('IMAGE_CYCLE', '이미지는 하루 한 장 등록하실 수 있습니다.', 'files');
error.define('IMAGE_NO_FILE', '아미지 파일이 첨부되지 않았습니다.', 'files');
error.define('IMAGE_SIZE', '이미지의 가로, 세로 크기가 너무 작습니다.', 'files');
error.define('IMAGE_TYPE', '인식할 수 없는 파일입니다.', 'files');

// images

var imageId;

init.add(function (done) {
  imageb.images = mongop.db.collection('images');
  imageb.images.createIndex({ uid: 1, _id: -1 }, done);
});

init.add(function (done) {
  mongop.getLastId(imageb.images, function (err, id) {
    if (err) return done(err);
    imageId = id;
    console.log('image-base: image id = ' + imageId);
    done();
  });
});

imageb.getNewId = function () {
  return ++imageId;
};

// files

// 원본과 버젼이 같은 디렉토리에 저장된다는 것을 전제로 작명하였다.
// 원본과 버젼이 같은 디렉토리에 있는 것이 좋을 것 같다.
// 같은 형태끼리 모으지 말고 관련된 것 끼리 모아 놓는다.
// 스토리지가 부족하면 원본/버젼을 분리할 것이 아니라
// id 영역별로 나누는 방안을 고려하면 된다.

// 원본 파일에 -org 를 붙여 놓는다.
// DB 없이 파일명으로 검색에 편리.

init.add(function (done) {
  fsp.makeDir(config.uploadDir + '/public/images', function (err, dir) {
    if (err) return done(err);

    if (config.dev) {
      imageb.emptyDir = function (done) {
        fsp.emptyDir(dir, done);
      }
    }

    imageb.FilePath = function (id, format) {
      this.id = id;
      this.dir = dir + '/' + fsp.makeDeepPath(id, 3);
      if (format) {
        this.original = this.dir + '/' + id + '-org.' + format;
      }
    }

    imageb.FilePath.prototype.getVersion = function (width) {
      return this.dir + '/' + this.id + '-' + width + '.jpg';
    }

    imageb.getUrlBase = function (id) {
      return config.uploadSite + '/images/' + fsp.makeDeepPath(id, 3)
    }

    done();
  });
});

imageb.identify = function (fname, done) {
  exec('identify -format "%m %w %h" ' + fname, function (err, stdout, stderr) {
    if (err) return done(err);
    var a = stdout.split(/[ \n]/);
    var width = parseInt(a[1]) || 0;
    var height = parseInt(a[2]) || 0;
    var meta = {
      format: a[0].toLowerCase(),
      width: width,
      height: height,
      shorter: width > height ? height : width
    };
    done(null, meta);
  });
};

/* TODO

public class PhotoContext {
    public const char FuncAll = 'A';
    public const char FuncCategory = 'C'; 
    public const char FuncUser = 'U';
    public const char FuncUserComment = 'M';
    public const char FuncDay = 'D';
    public const char FuncFav = 'F';

    static Hashtable categories;
    static ArrayList categoriesAry;

    public char Function;
    public int PhotoID;
    public int CategoryID;
    public string Sort;
    public char SortKey;
    public char SortDir;
    public DateTime Day;
    public int PageNumber;
    public string SearchString;
    public Bah.Web.Http.UrlMaker UrlMaker; 


    private WebSite.Page Page; 

    public static void InitStaticTables() {
      SqlConnection conn;
      SqlCommand cmd;
      SqlDataReader reader;
      using (conn = new SqlConnection(WebSite.Global.DSN)) {
        conn.Open();
        cmd = new SqlCommand("PhotoSelectCategoryConst", conn);
        cmd.CommandType = CommandType.StoredProcedure;
        reader = cmd.ExecuteReader();

        Hashtable newCategories = new Hashtable(128);
        ArrayList newCategoriesAry = new ArrayList(128);
        while (reader.Read()) {
          PhotoCategory category = new PhotoCategory();
          category.LoadFromDataReader(reader);
          newCategories.Add(category.ID, category);
          newCategoriesAry.Add(category);
        }
        categories = newCategories;
        categoriesAry = newCategoriesAry;
        reader.Close();
      }
    }

    public PhotoContext(WebSite.Page page) {
      this.Page = page;

      //function = LPContext.CurrentNode.AttrString("func")[0];  
      Function = Page.SafeQueryChar("f",FuncAll); 
      
      PhotoID = Page.SafeQueryInt32("p", 0);
      CategoryID = Page.SafeQueryInt32("c", 0);

      Sort = Page.SafeQueryString("s", "DD");
      switch (Function) {
        case FuncAll:
        case FuncCategory:
        case FuncUser:
          / * 추천수, 패널추천수 보기 삭제 * /
          if (Sort == "RD" || Sort == "PD") {
            Sort = "DD";
          }
          break;
      }
      SortKey = Sort[0];
      SortDir = Sort[1];
      PageNumber = Page.SafeQueryInt32("pg", 0);
      
      if (Function == FuncUser || Function == FuncUserComment) {
        Page.Assert(Page.OwnerID > 0);
      }

      / *
      if (LPContext.Dir.StartsWith("/App/PSN") && userID != UserID) {
        Response.Redirect(new Regex("([^\\?]*)/([^\\?]*)/(.*)").Replace(LPContext.RawUrl,"/App/User/Info/$2/$3"));
      }
      * /
      
      / *
      searchString = SafeQueryString("ss", "");
      if (searchString.Length > 0) {
        LPContext.UrlMaker.AddParam("ss", searchString);
      }
      * /

      UrlMaker = Page.LPContext.UrlMaker.Clone();

      UrlMaker.AddParam("f", Function);
      if (CategoryID > 0) UrlMaker.AddParam("c", CategoryID);
      if (Sort != "DD") UrlMaker.AddParam("s", Sort);
      if (PageNumber > 0) UrlMaker.AddParam("pg",PageNumber);
      
      if (Function == 'D') {
        string strDay = Page.SafeQueryString("d","");
        if (strDay.Length > 0) {
          Day = DateTime.ParseExact(strDay,"yyMMdd",null);
          UrlMaker.AddParam("d", strDay);
        } else {
          Day = DateTime.Now.Date;
        }
      }
    }

    public static Hashtable Categories {
      get {
        return categories;
      }
    }

    public static ArrayList CategoriesAry {
      get {
        return categoriesAry;
      }
    }

    public PhotoCategory Category {
      get {
        return (PhotoCategory)categories[CategoryID];
      }
    }

    / *
    public void SaveAttachFiles() {
      try {
        //PDSManager pm = new PDSManager("P", PhotoID);
        //PDSManager pmt = new PDSManager("T");
        
        //pm.FileSizeLimit = 500 * 1024;
        pm.SaveFiles(true);

        string[] files = Directory.GetFiles(pm.PhysicalDir);
        Bah.Drawing.Util.MakeThumbnail(files[0], pmt.PhysicalDir + "\\" + PhotoID + ".jpg", 140, Bah.Drawing.Util.ThumbnailMold.Both, 90L);
      } catch (System.IO.DirectoryNotFoundException) {
      }
    } 
    * /

    public void SaveAttachFiles(int userid, SqlConnection conn) {
      BDSManager dsm = new BDSManager(userid, conn, "PP", PhotoID);
      BDSManager dsmt = new BDSManager(userid, conn, "PT", 0);
      dsm.SaveFiles(true);
      dsmt.MakeThumbnail(dsm.GetFiles()[0], PhotoID, 140);
    } 



    static public void MakeCategoryCBList(SqlConnection conn, Control panel) {
      SqlCommand cmd;
      SqlDataReader reader;
      int high = 0, prevHigh = 0;
      int cid = 0;
      foreach(PhotoCategory category in categoriesAry) {
        CheckBox cb = new CheckBox();
        cid = category.ID;
        cb.Text = category.Desc;
        cb.ID = cid.ToString();
        high = cid / 100;
        if (high != prevHigh && prevHigh > 0) {
          panel.Controls.Add(new LiteralControl("<br>"));
        }
        / *
        if (cid == 9010) {
          cb.Text += " - 부분 채색이 있거나 채도가 높은 모노톤 이미지는 배제";
        }* /
        panel.Controls.Add(cb);
        prevHigh = high;
      }
    }

    public void InsertCategory(SqlConnection conn, Control panel) {
      SqlCommand cmd = new SqlCommand("PhotoAddCategory", conn);
      cmd.CommandType = CommandType.StoredProcedure;
      cmd.Parameters.Add("@PhotoID", SqlDbType.Int).Value = PhotoID;
      cmd.Parameters.Add("@CategoryID", SqlDbType.SmallInt);
      CheckBox cb;
      int cbCnt = 0;
      foreach (Control c in panel.Controls) {
        cb = c as CheckBox;
        if (cb != null) {
          if (cb.Checked) {
            cmd.Parameters["@CategoryID"].Value = Int16.Parse(cb.ID);
            cmd.ExecuteNonQuery();
            if (++cbCnt == 3) {
              break;
            }
          }
        }
      }
    }

    public static string GetRefPhotoScript(int userid, int pid, int border, bool showLink) {
      string path = new BDSManager(userid, null, "PP", pid).GetVirtualFilePath();

      if (path != null) {
        ScriptBuilder script = new ScriptBuilder(1024);

        script.ScriptBegin();
        script.Func("lpRPB");
        script.FuncBegin("lpRP");
        script.ParamEscaped(path);
        script.Param(border);
        script.FuncEnd();

        if (showLink) {
          script.FuncBegin("lpRPL").Param(pid).FuncEnd();
        }

        script.Func("lpRPE");
        script.ScriptEnd();

        return script.ToString();
      }
      return "";
    }
  }

*/
